using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public interface IHabitLogService
    {
        Task<List<HabitLogDto>> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize);
        Task<HabitLogDto> GetHabitLogByIdAsync(Guid habitLogId);
        Task<List<HabitLogDto>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate);
        Task<HabitLogDto> UpdateHabitLogAsync(HabitLogDto habitLog, HabitLogUpdateDto habitLogUpdateDto);
        Task<HabitLogDto> DeleteHabitLogAsync(HabitLogDto habitLog);
    }
}
