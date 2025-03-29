using Elevate.Common.Utilities;
using Elevate.Data.Database;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{

    public class HabitLogGeneratorRepository(ElevateDbContext context)
    {
        private readonly ElevateDbContext _context = context;

        public async Task<List<HabitLogModel>> GenerateLogsForHabitAsync(HabitModel habit, DateTime? endDate = null)
        {
            var now = DateTime.UtcNow;
            var startDate = now.Date;

            var currentMonth = now.Month;
            var currentYear = now.Year;
            var nextMonth = currentMonth == 12 ? 1 : currentMonth + 1;
            var nextMonthYear = currentMonth == 12 ? currentYear + 1 : currentYear;

            var lastDayOfNextMonth = new DateTime(nextMonthYear, nextMonth, DateTime.DaysInMonth(nextMonthYear, nextMonth));

            var targetEndDate = endDate ?? lastDayOfNextMonth;
            var allNewLogs = new List<HabitLogModel>();

            var ownerLogs = await GenerateLogsForUserAsync(habit, habit.UserId, startDate, targetEndDate);
            allNewLogs.AddRange(ownerLogs);

            foreach (var friendId in habit.ChallengedFriends)
            {
                if (friendId == habit.UserId)
                    continue;

                var friendLogs = await GenerateLogsForUserAsync(habit, friendId, startDate, targetEndDate);
                allNewLogs.AddRange(friendLogs);
            }

            if (allNewLogs.Count > 0)
            {
                await _context.Set<HabitLogModel>().AddRangeAsync(allNewLogs);
                await _context.SaveChangesAsync();
            }

            return allNewLogs;
        }

        private async Task<List<HabitLogModel>> GenerateLogsForUserAsync(HabitModel habit, Guid userId, DateTime startDate, DateTime endDate)
        {
            var existingDates = await _context.Set<HabitLogModel>()
                .Where(l => l.HabitId == habit.Id && l.UserId == userId)
                .Select(l => l.DueDate.Date)
                .ToListAsync();

            var newLogs = new List<HabitLogModel>();

            if (habit.FrequencyType == FrequencyEnum.Custom && habit.CustomFrequency.HasValue)
            {
                newLogs.AddRange(GenerateCustomFrequencyLogs(habit, userId, startDate, endDate, existingDates));
            }
            else
            {
                newLogs.AddRange(GenerateStandardFrequencyLogs(habit, userId, startDate, endDate, existingDates));
            }

            return newLogs;
        }

        private List<HabitLogModel> GenerateStandardFrequencyLogs(HabitModel habit, Guid userId, DateTime startDate, DateTime endDate, List<DateTime> existingDates)
        {
            var newLogs = new List<HabitLogModel>();
            var currentDate = startDate;

            while (currentDate <= endDate)
            {
                bool includeDate = false;

                switch (habit.FrequencyType)
                {
                    case FrequencyEnum.Daily:
                        includeDate = true;
                        break;

                    case FrequencyEnum.Weekly:
                        includeDate = currentDate.DayOfWeek == startDate.DayOfWeek;
                        break;

                    case FrequencyEnum.Monthly:
                        includeDate = currentDate.Day == startDate.Day;
                        break;
                }

                if (includeDate && !existingDates.Contains(currentDate.Date))
                {
                    newLogs.Add(CreateLog(habit, userId, currentDate));
                }

                currentDate = currentDate.AddDays(1);

                if (habit.FrequencyType == FrequencyEnum.Monthly &&
                    currentDate.Day == 1 &&
                    startDate.Day > DateTime.DaysInMonth(currentDate.Year, currentDate.Month))
                {
                    var lastDayOfMonth = new DateTime(
                        currentDate.Year,
                        currentDate.Month,
                        DateTime.DaysInMonth(currentDate.Year, currentDate.Month)
                    ).AddDays(-1);

                    if (!existingDates.Contains(lastDayOfMonth.Date))
                    {
                        newLogs.Add(CreateLog(habit, userId, lastDayOfMonth));
                    }
                }
            }
            return newLogs;
        }

        private List<HabitLogModel> GenerateCustomFrequencyLogs(HabitModel habit, Guid userId, DateTime startDate, DateTime endDate, List<DateTime> existingDates)
        {
            var newLogs = new List<HabitLogModel>();
            sbyte customFrequency = habit.CustomFrequency ?? 0;
            if (customFrequency == 0) return newLogs;

            // Monday = bit 6 (64),
            // Sunday = bit 0 (1)
            int[] dayMap = { 0, 6, 5, 4, 3, 2, 1 };

            var currentDate = startDate.Date;
            var endDateMidnight = endDate.Date;
            while (currentDate <= endDateMidnight)
            {
                int dayOfWeek = (int)currentDate.DayOfWeek;
                int bitPosition = dayMap[dayOfWeek];
                bool isDaySelected = (customFrequency & (1 << bitPosition)) != 0;

                if (isDaySelected && !existingDates.Contains(currentDate))
                {
                    newLogs.Add(CreateLog(habit, userId, currentDate));
                }
                currentDate = currentDate.AddDays(1);
            }

            return newLogs;
        }

        private HabitLogModel CreateLog(HabitModel habit, Guid userId, DateTime date)
        {
            var dueDateTime = date.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            return new HabitLogModel
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                HabitId = habit.Id,
                DueDate = dueDateTime,
                Completed = false,
                CompletedAt = null,
                Notes = null,
                IsPublic = false
            };
        }

    }
}
