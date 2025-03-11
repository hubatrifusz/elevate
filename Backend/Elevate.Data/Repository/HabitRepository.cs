using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Models.Habit;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class HabitRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public async Task<List<HabitModel>> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            pageSize = Math.Min(pageSize, 20);
            pageSize = Math.Max(pageSize, 1);

            return await _context.Habits.Where(h => h.UserId == userId).OrderBy(h => h.CreatedAt).ApplyPagination(pageNumber, pageSize).ToListAsync();
        }

        public async Task<HabitModel?> GetHabitByIdAsync(Guid habitId)
        {
            return await _context.Habits.SingleAsync(h => h.Id == habitId);
        }

        public async Task<List<HabitModel>> GetAllHabitsAsync()
        {
            return await _context.Habits.ToListAsync();
        }

        public async Task<HabitModel?> AddHabitAsync(HabitModel habit)
        {
            await _context.Habits.AddAsync(habit);
            await _context.SaveChangesAsync();
            return habit;
        }

        public async Task<HabitModel?> UpdateHabitAsync(Guid id, HabitModel habit)
        {
            if (id != habit.Id)
            {
                throw new Exception("Habit ID does not match");
            }
            if (!await _context.Set<HabitModel>().AnyAsync(h => h.Id == id))
            {
                throw new Exception("No such habit");
            }
            HabitModel updatedHabit = _context.Set<HabitModel>().Update(habit).Entity;
            await _context.SaveChangesAsync();
            return updatedHabit;
        }

        public async Task<HabitModel?> DeleteHabitAsync(Guid habitId) 
        {
            HabitModel? habit = await _context.Set<HabitModel>().SingleOrDefaultAsync(h => h.Id == habitId);
            if (habit == null)
            {
                throw new Exception("No such habit");
            }
            _context.Set<HabitModel>().Remove(habit);
            await _context.SaveChangesAsync();
            return habit;
        }
    }
}
