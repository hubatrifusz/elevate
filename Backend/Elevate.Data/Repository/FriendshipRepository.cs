using Elevate.Data.Database;
using Elevate.Models.Friendship;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class FriendshipRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public async Task<List<ApplicationUser>> GetFriendsAsync(Guid userId)
        {
            return await _context.Users
                .Where(u => _context.Friendships.Any(f =>
                    (f.UserId == userId && f.FriendId == u.Id) ||
                    (f.FriendId == userId && f.UserId == u.Id)))
                .ToListAsync();
        }

        public async Task<FriendshipModel> AddFriendshipAsync(FriendshipModel friendship)
        {
            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }

        public async Task<FriendshipModel> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => 
                    (f.UserId == userId && f.FriendId == friendId) ||
                    (f.UserId == friendId && f.FriendId == userId)
                );

            if (friendship == null)
            {
                throw new Exception("Users are not friends");
            }

            _context.Friendships.Remove(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }
    }
}
