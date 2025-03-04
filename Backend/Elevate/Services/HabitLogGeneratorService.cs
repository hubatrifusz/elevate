using Elevate.Data.Repository;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public class HabitLogGeneratorService(HabitLogGeneratorRepository habitLogGeneratorRepository, HabitRepository habitRepository, ILogger<HabitLogGeneratorService> logger) : IHabitLogGeneratorService
    {
        private readonly HabitLogGeneratorRepository _habitLogGeneratorRepository = habitLogGeneratorRepository;
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly ILogger<HabitLogGeneratorService> _logger = logger;

        public async Task<List<HabitLogModel>> GenerateLogsForHabitAsync(HabitModel habit, DateTime? endDate = null)
        {
            if (habit == null)
            {
                _logger.LogWarning($"Attempted to generate logs for non existent habit.");
                return new List<HabitLogModel>();
            }

            try
            {
                var logs = await _habitLogGeneratorRepository.GenerateLogsForHabitAsync(habit, endDate);
                return logs;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to generate logs for habit {habit.Id}");
                return new List<HabitLogModel>();
            }
        }

        public async Task<int> GenerateLogsForAllHabitsAsync()
        {
            try
            {
                var habits = _habitRepository.GetAllHabits();
                int totalLogsGenerated = 0;

                foreach (var habit in habits)
                {
                    if (!habit.Deleted)
                    {
                        List<HabitLogModel> logs = await _habitLogGeneratorRepository.GenerateLogsForHabitAsync(habit);
                        totalLogsGenerated += logs.Count;
                    }
                }
                return totalLogsGenerated;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Failed to generate logs for all habits");
                return 0;
            }
        }
    }
}
