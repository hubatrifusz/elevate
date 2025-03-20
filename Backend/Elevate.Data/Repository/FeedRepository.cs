using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Models.HabitLog;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class FeedRepository(ElevateDbContext context)
    {
        private readonly ElevateDbContext _context = context;

        public async Task<List<HabitLogModel>> GetFeedAsync(int pageNumber, int pageSize)
        {
            return await _context.HabitLogs
                .Where(hl => !hl.Deleted && hl.IsPublic)
                .OrderByDescending(hl => hl.CompletedAt)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
        }
    }
}
