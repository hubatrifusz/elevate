using Elevate.Models.Habit;

namespace Elevate.Services
{
    public interface IHabitService
    {
        Task<List<HabitModel>?> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
        Task<HabitModel?> GetHabitByIdAsync(Guid habitId);
        Task<HabitDto?> AddHabitAsync(HabitCreateDto habit);
        Task<HabitModel?> UpdateHabitAsync(Guid id, HabitUpdateDto habit);
        Task<HabitModel?> DeleteHabitAsync(Guid habitId);
    }
}
