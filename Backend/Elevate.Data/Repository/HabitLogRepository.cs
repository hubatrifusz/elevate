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
            return await _context.Set<HabitLogModel>()
                .Where(hl => hl.HabitId == habitId)
                .OrderBy(hl => hl.DueDate)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
        }

        public async Task<HabitLogModel?> GetHabitLogByIdAsync(Guid habitLogId)
        {
            return await _context.Set<HabitLogModel>().SingleAsync(hl => hl.Id == habitLogId);
        }

        public async Task<List<HabitLogModel>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate)
        {
            return await _context.Set<HabitLogModel>()
                .Where(hl => hl.UserId == userId && hl.DueDate.Date == dueDate.Date)
                .ToListAsync();
        }

        public async Task<HabitLogModel?> UpdateHabitLogAsync(HabitLogModel habitLog)
        {
            _context.Set<HabitLogModel>().Update(habitLog);
            await _context.SaveChangesAsync();
            return await _context.Set<HabitLogModel>().SingleAsync(hl => hl.Id == habitLog.Id);
        }

        public async Task<HabitLogModel?> DeleteHabitLogAsync(HabitLogModel habitLogToDelete)
        {
            _context.Set<HabitLogModel>().Remove(habitLogToDelete);
            await _context.SaveChangesAsync();
            return habitLogToDelete;
        }
    }
}
