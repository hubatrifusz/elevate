using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public interface IStreakService
    {
        public Task UpdateStreakForHabitLog(HabitLogModel habitLog);
        public Task CheckAndResetBrokenStreaks();
    }
}
