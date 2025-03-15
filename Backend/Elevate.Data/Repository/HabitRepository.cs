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
            return await _context.Habits
                .Where(h => h.UserId == userId)
                .OrderBy(h => h.CreatedAt)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
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

        public async Task<HabitModel?> UpdateHabitAsync(HabitModel habit)
        {
            _context.Habits.Update(habit);
            await _context.SaveChangesAsync();
            return await GetHabitByIdAsync(habit.Id);
        }

        public async Task<HabitModel?> DeleteHabitAsync(HabitModel habit) 
        {
            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync();
            return habit;
        }
    }
}
