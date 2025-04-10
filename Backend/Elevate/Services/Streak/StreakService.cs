using Elevate.Data.Repository;
using Elevate.Models.HabitLog;

namespace Elevate.Services.Streak
{
    public class StreakService(HabitRepository habitRepository, HabitLogRepository habitLogRepository) : IStreakService
    {
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly HabitLogRepository _habitLogRepository = habitLogRepository;

        public async Task UpdateStreakForHabitLog(HabitLogModel habitLog)
        {
            if (!habitLog.Completed) return;

            var habit = await _habitRepository.GetHabitByIdAsync(habitLog.HabitId);
            if (habit == null || habit.Deleted) return;

            if (habit.ChallengedFriends.Count == 0)
            {
                habit.Streak++;
            }
            else
            {
                var streakProgression = habit.StreakProgression.Split('/');

                int currentProgress = int.Parse(streakProgression[0]) + 1;
                int requiredProgress = int.Parse(streakProgression[1]) + 1;

                habit.StreakProgression = $"" +
                    $"{currentProgress}" +
                    $"/{requiredProgress}";

                if (currentProgress == requiredProgress)
                {
                    habit.Streak++;
                }
            }
            await _habitRepository.UpdateHabitAsync(habit);
        }

        public async Task UpdateHighestStreak(Guid userId)
        {
            await _habitRepository.UpdateHighestStreak(userId);
        }

        public async Task CheckAndResetBrokenStreaks()
        {
            var habits = await _habitRepository.GetAllHabitsAsync();
            var now = DateTime.UtcNow;

            foreach (var habit in habits)
            {
                if (habit.Deleted) continue;

                var missedLog = await _habitLogRepository.GetOldestMissedHabitLogAsync(habit.Id, now);

                if (missedLog != null)
                {
                    habit.Streak = 0;
                    habit.StreakStart = now;
                    await _habitRepository.UpdateHabitAsync(habit);
                }
            }
        }
    }
}