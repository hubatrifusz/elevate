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
            var friends = await _context.Friendships
                .Where(f => f.UserId == userId || f.FriendId == userId)
                .Select(f => f.UserId == userId ? f.FriendId : f.UserId)
                .ToListAsync();

            return await _context.Users.Where(u => friends.Contains(u.Id)).ToListAsync();
        }

        public async Task<Friendship> AddFriendshipAsync(Friendship friendship)
        {
            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }

        public async Task<Friendship> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => (f.UserId == userId && f.FriendId == friendId) || (f.UserId == friendId && f.FriendId == userId));

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
