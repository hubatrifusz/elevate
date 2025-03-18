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
            var now = DateTimeConverter.GetCetTime();
            var startDate = now.Date;

            var currentMonth = now.Month;
            var currentYear = now.Year;
            var nextMonth = currentMonth == 12 ? 1 : currentMonth + 1;
            var nextMonthYear = currentMonth == 12 ? currentYear + 1 : currentYear;

            var lastDayOfNextMonth = new DateTime(nextMonthYear, nextMonth, DateTime.DaysInMonth(nextMonthYear, nextMonth));

            var targetEndDate = endDate ?? lastDayOfNextMonth;

            var existingDates = await _context.Set<HabitLogModel>()
                .Where(l => l.HabitId == habit.Id)
                .Select(l => l.DueDate.Date)
                .ToListAsync();

            var newLogs = new List<HabitLogModel>();

            if (habit.FrequencyType == FrequencyEnum.Custom && habit.CustomFrequency.HasValue)
            {
                newLogs.AddRange(GenerateCustomFrequencyLogs(habit, startDate, targetEndDate, existingDates));
            }
            else
            {
                newLogs.AddRange(GenerateStandardFrequencyLogs(habit, startDate, targetEndDate, existingDates));
            }

            if (newLogs.Count != 0)
            {
                await _context.Set<HabitLogModel>().AddRangeAsync(newLogs);
                await _context.SaveChangesAsync();
            }

            return newLogs;
        }

        private List<HabitLogModel> GenerateStandardFrequencyLogs(HabitModel habit, DateTime startDate, DateTime endDate, List<DateTime> existingDates)
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
                    newLogs.Add(CreateLog(habit, currentDate));
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
                        newLogs.Add(CreateLog(habit, lastDayOfMonth));
                    }
                }
            }
            return newLogs;
        }

        private List<HabitLogModel> GenerateCustomFrequencyLogs(HabitModel habit, DateTime startDate, DateTime endDate, List<DateTime> existingDates)
        {
            var newLogs = new List<HabitLogModel>();

            sbyte customFrequency = habit.CustomFrequency ?? 0;
            if (customFrequency == 0)
            {
                return newLogs;
            }

            var currentDate = startDate.Date;
            DateTime endDateMidnight = endDate.Date;

            while (currentDate <= endDateMidnight)
            {
                // Monday = bit 0, Tuesday = bit 1, ... Sunday = bit 6
                int dayOfWeek = (int)currentDate.DayOfWeek;
                int bitPosition = dayOfWeek == 0 ? 6 : dayOfWeek - 1;

                bool isDaySelected = ((customFrequency >> bitPosition) & 1) != 0;

                DateTime currentDateMidnight = currentDate.Date;
                if (isDaySelected && !existingDates.Contains(currentDateMidnight))
                {
                    newLogs.Add(CreateLog(habit, currentDateMidnight));
                }

                currentDate = currentDate.AddDays(1);
            }

            return newLogs;
        }

        private HabitLogModel CreateLog(HabitModel habit, DateTime date)
        {
            var dueDateTime = date.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            return new HabitLogModel
            {
                Id = Guid.NewGuid(),
                UserId = habit.UserId,
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
