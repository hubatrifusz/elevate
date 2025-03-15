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

        public async Task<FriendshipModel?> AddFriendshipAsync(FriendshipModel friendship)
        {
            await _context.Friendships.AddAsync(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }

        public async Task<FriendshipModel?> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            FriendshipModel friendship = await _context.Friendships
                .FirstAsync(f => 
                    (f.UserId == userId && f.FriendId == friendId) ||
                    (f.UserId == friendId && f.FriendId == userId)
                );

            _context.Friendships.Remove(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }
    }
}
