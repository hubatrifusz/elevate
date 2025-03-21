using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Models.HabitLog;
using Elevate.Models.Post;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class FeedRepository(ElevateDbContext context)
    {
        private readonly ElevateDbContext _context = context;

        public async Task<List<PostModel>> GetFeedAsync(int pageNumber, int pageSize)
        {
            List<HabitLogModel> habitLogs = await _context.HabitLogs
                .Where(hl => !hl.Deleted && hl.IsPublic)
                .OrderByDescending(hl => hl.CompletedAt)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();

            List<Guid> habitIds = habitLogs.Select(hl => hl.HabitId).Distinct().ToList();
            List<Guid> userIds = habitLogs.Select(hl => hl.UserId).Distinct().ToList();

            var habits = await _context.Habits
                .Where(h => habitIds.Contains(h.Id))
                .ToDictionaryAsync(h => h.Id);

            var users = await _context.ApplicationUsers
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id);

            var result = habitLogs.Select(hl => new PostModel
            {
                HabitLogModel = hl,
                HabitModel = habits.GetValueOrDefault(hl.HabitId),
                User = users.GetValueOrDefault(hl.UserId)
            }).ToList();

            return result;
        }
    }
}
