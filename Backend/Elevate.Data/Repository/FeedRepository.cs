using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.Post;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class FeedRepository(
        ElevateDbContext context, 
        UserRepository userRepository, 
        HabitRepository habitRepository)
    {
        private readonly ElevateDbContext _context = context;
        private readonly UserRepository _userRepository = userRepository;
        private readonly HabitRepository _habitRepository = habitRepository;

        public async Task<List<PostModel>> GetFeedAsync(int pageNumber, int pageSize)
        {
            List<HabitLogModel> habitLogs = await _context.HabitLogs
                .Where(hl => !hl.Deleted && hl.IsPublic)
                .OrderByDescending(hl => hl.CompletedAt)
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();

            List<PostModel> posts = new();

            foreach (HabitLogModel habitLog in habitLogs)
            {
                ApplicationUser? user = await _userRepository.GetUserByIdAsync(habitLog.UserId);
                HabitModel? habit = await _habitRepository.GetHabitByIdAsync(habitLog.HabitId);

                posts.Add(new PostModel
                {
                    User = user,
                    Habit = habit,
                    HabitLog = habitLog
                });
            }
            return posts;
        }
    }
}
