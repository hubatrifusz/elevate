﻿using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Models.Habit;
using Elevate.Models.NegativeHabit;
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

        public async Task<int> UpdateHighestStreak(Guid userId)
        {
            var habit = await _context.Habits
                .Where(h => h.UserId == userId && !h.Deleted)
                .OrderByDescending(h => h.Streak)
                .FirstOrDefaultAsync();
            if (habit != null)
            {
                await _context.ApplicationUsers
                    .Where(u => u.Id == userId)
                    .ExecuteUpdateAsync(u => u.SetProperty(x => x.LongestStreak, habit.Streak));
                await _context.SaveChangesAsync();
                return habit.Streak;
            }
            return 0;
        }

        public async Task<NegativeHabitModel?> GetNegativeHabitByIdAsync(Guid habitId)
        {
            NegativeHabitModel? habit = await _context.NegativeHabits.FindAsync(habitId);
            return habit?.Deleted == true ? null : habit;
        }

        public async Task<List<NegativeHabitModel>> GetNegativeHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize) 
        {
            return await _context.NegativeHabits
               .Where(h => (h.UserId == userId && !h.Deleted))
               .OrderBy(h => h.UpdatedAt)
               .ApplyPagination(pageNumber, pageSize)
               .ToListAsync();
        }

        public async Task<NegativeHabitModel?> AddNegativeHabitAsync(NegativeHabitModel habit)
        {
            await _context.NegativeHabits.AddAsync(habit);
            await _context.SaveChangesAsync();
            return habit;
        }

        public async Task<NegativeHabitModel?> UpdateNegativeHabitAsync(NegativeHabitModel habit)
        {
            var existingHabit = await _context.NegativeHabits.FindAsync(habit.Id);

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
