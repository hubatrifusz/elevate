using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Models.HabitLog;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class HabitLogRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public async Task<List<HabitLogModel>> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize)
        {
            return await _context.HabitLogs
                .Where(hl => hl.HabitId == habitId && !hl.Deleted)
                .OrderBy(hl => hl.DueDate)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
        }

        public async Task<HabitLogModel?> GetHabitLogByIdAsync(Guid habitLogId)
        {
            HabitLogModel? habitLog = await _context.HabitLogs
                .Where(hl => hl.Id == habitLogId && !hl.Deleted)
                .FirstOrDefaultAsync();

            return habitLog;
        }

        public async Task<List<HabitLogModel>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate)
        {
            return await _context.HabitLogs
                .Where(hl => hl.UserId == userId && !hl.Deleted && hl.DueDate.Date == dueDate.Date)
                .ToListAsync();
        }

        public async Task<HabitLogModel?> UpdateHabitLogAsync(HabitLogModel habitLog)
        {
            var existingHabitLog = await GetHabitLogByIdAsync(habitLog.Id);

            if (existingHabitLog != null)
            {
                _context.Entry(existingHabitLog).CurrentValues.SetValues(habitLog);

                await _context.SaveChangesAsync();
                return existingHabitLog;
            }

            return null;
        }

        public async Task<HabitLogModel?> GetOldestMissedHabitLogAsync(Guid habitId, DateTime currentTime)
        {
            return await _context.HabitLogs
                .Where(hl => hl.HabitId == habitId &&
                             !hl.Completed &&
                             !hl.Deleted &&
                             hl.DueDate < currentTime)
                .OrderBy(hl => hl.DueDate)
                .FirstOrDefaultAsync();
        }
    }
}
