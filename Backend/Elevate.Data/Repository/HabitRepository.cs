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
            HabitModel savedHabit = _context.Set<HabitModel>().Add(habit).Entity;
            _context.SaveChanges();
            return savedHabit;
        }

        public HabitModel? UpdateHabit(Guid id, HabitModel habit)
        {
            if (id != habit.Id)
            {
                throw new Exception("Habit ID does not match");
            }
            if (!_context.Set<HabitModel>().Any(h => h.Id == id))
            {
                throw new Exception("No such habit");
            }
            HabitModel updatedHabit = _context.Set<HabitModel>().Update(habit).Entity;
            _context.SaveChanges();
            return updatedHabit;
        }

        public HabitModel? DeleteHabit(Guid habitId) 
        {
            HabitModel? habit = _context.Set<HabitModel>().SingleOrDefault(h => h.Id == habitId);
            if (habit == null)
            {
                throw new Exception("No such habit");
            }
            _context.Set<HabitModel>().Remove(habit);
            _context.SaveChanges();
            return habit;
        }
    }
}
