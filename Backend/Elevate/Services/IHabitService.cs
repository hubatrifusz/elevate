using Elevate.Models.Habit;

namespace Elevate.Services
{
    public interface IHabitService
    {
        Task<List<HabitDto>?> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
        Task<HabitDto?> GetHabitByIdAsync(Guid habitId);
        Task<HabitDto?> AddHabitAsync(HabitCreateDto habit);
        Task<HabitDto?> UpdateHabitAsync(Guid id, HabitUpdateDto habit);
        Task<HabitDto?> DeleteHabitAsync(Guid habitId);
    }
}
