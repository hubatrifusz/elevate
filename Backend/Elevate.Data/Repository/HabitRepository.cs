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
                .Where(h => (h.UserId == userId || h.ChallengedFriends.Contains(userId)) && !h.Deleted)
                .OrderBy(h => h.CreatedAt)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
        }

        public async Task<HabitModel?> GetHabitByIdAsync(Guid habitId)
        {
            HabitModel? habit = await _context.Habits.FindAsync(habitId);
            return habit?.Deleted == true ? null : habit;
        }

        public async Task<List<HabitModel>> GetAllHabitsAsync()
        {
            return await _context.Habits.Where(h => !h.Deleted).ToListAsync();
        }

        public async Task<HabitModel?> AddHabitAsync(HabitModel habit)
        {
            await _context.Habits.AddAsync(habit);
            await _context.SaveChangesAsync();
            return habit;
        }

        public async Task<HabitModel?> UpdateHabitAsync(HabitModel habit)
        {
            var existingHabit = await GetHabitByIdAsync(habit.Id);

            if (existingHabit != null)
            {
                _context.Entry(existingHabit).CurrentValues.SetValues(habit);

                await _context.SaveChangesAsync();
                return existingHabit;
            }

            return null;
        }
    }
}
