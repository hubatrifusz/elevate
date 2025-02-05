using Elevate.Models.Habit;
using Elevate.Models.User;

namespace Elevate.Data.Repository
{
    public class HabitRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public HabitModel? GetHabitById(Guid habitId)
        {
            return _context.Set<HabitModel>().SingleOrDefault(h => h.Id == habitId);
        }

        public HabitModel? AddHabit(HabitModel habit)
        {
            UserModel savedHabit = _context.Set<HabitModel>().Add(habit).Entity;
            _context.SaveChanges();
            return savedHabit;
        }
    }
}
