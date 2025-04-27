using Elevate.Models.Habit;
using Elevate.Models.NegativeHabit;

namespace Elevate.Services.Habit
{
    public interface IHabitService
    {
        Task<List<HabitDto>> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
        Task<HabitDto> GetHabitByIdAsync(Guid habitId);
        Task<HabitDto> AddHabitAsync(HabitCreateDto habit);
        Task<HabitDto> UpdateHabitAsync(Guid id, HabitUpdateDto habit);
        Task<HabitDto> DeleteHabitAsync(HabitDto habit);
        Task<List<NegativeHabitDto>> GetNegativeHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
        Task<NegativeHabitDto> GetNegativeHabitByIdAsync(Guid habitId);
        Task<NegativeHabitDto> AddNegativeHabitAsync(NegativeHabitCreateDto habit);
        Task<NegativeHabitDto> UpdateNegativeHabitAsync(Guid id);
        Task<NegativeHabitDto> DeleteNegativeHabitAsync(NegativeHabitDto habit);
    }
}
