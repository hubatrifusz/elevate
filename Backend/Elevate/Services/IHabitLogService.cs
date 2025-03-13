using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public interface IHabitLogService
    {
        Task<List<HabitLogDto>> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize);
        Task<HabitLogDto> GetHabitLogByIdAsync(Guid habitLogId);
        Task<List<HabitLogDto>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate);
        Task<HabitLogDto> AddHabitLogAsync(HabitLogCreateDto habitLog);
        Task<HabitLogDto> UpdateHabitLogAsync(Guid id, HabitLogUpdateDto habitLog);
        Task<HabitLogDto> DeleteHabitLogAsync(Guid habitLogId);
    }
}
