using Elevate.Models.HabitLog;

namespace Elevate.Services.Streak
{
    public interface IStreakService
    {
        public Task UpdateStreakForHabitLog(HabitLogModel habitLog);
        public Task CheckAndResetBrokenStreaks();
    }
}
