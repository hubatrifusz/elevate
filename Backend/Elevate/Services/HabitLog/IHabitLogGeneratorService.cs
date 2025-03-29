using Elevate.Models.Habit;
using Elevate.Models.HabitLog;

namespace Elevate.Services.HabitLog
{
    public interface IHabitLogGeneratorService
    {
        Task<List<HabitLogModel>> GenerateLogsForHabitAsync(HabitModel habit, DateTime? endDate = null);
        Task<int> GenerateLogsForAllHabitsAsync();
    }
}
