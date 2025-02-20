using Elevate.Models.Habit;

namespace Elevate.Services
{
    public interface IHabitService
    {
        List<HabitModel>? GetHabitsByUserId(Guid userId, int pageNumber, int pageSize);
        HabitModel? GetHabitById(Guid habitId);
        HabitModel? AddHabit(HabitCreateDto habit);
        HabitModel? UpdateHabit(Guid id, HabitUpdateDto habit);
        HabitModel? DeleteHabit(Guid habitId);
    }
}
