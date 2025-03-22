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
                    ((f.UserId == userId && f.FriendId == u.Id) ||
                    (f.FriendId == userId && f.UserId == u.Id)) &&
                    f.Status == FriendshipStatus.Accepted))
                .ToListAsync();
        }

        public async Task<List<ApplicationUser>> GetFriendRequestsAsync(Guid userId)
        {
            return await _context.Users
                .Where(u => _context.Friendships.Any(f =>
                    (f.FriendId == userId && f.UserId == u.Id) &&
                    f.Status == FriendshipStatus.Pending))
                .ToListAsync();
        }

        public async Task<bool> AreFriends(Guid userId, Guid friendId)
        {
            return await _context.Friendships
                .AnyAsync(f =>
                    (f.UserId == userId && f.FriendId == friendId) ||
                    (f.UserId == friendId && f.FriendId == userId)
                );
        }

        public async Task<FriendshipModel?> AddFriendshipAsync(FriendshipModel friendship)
        {
            await _context.Friendships.AddAsync(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }

        public async Task<FriendshipModel?> UpdateFriendshipAsync(FriendshipModel friendship)
        {
            var existingFriendship = await _context.Friendships
                .FirstOrDefaultAsync(f =>
                    (f.UserId == friendship.UserId && f.FriendId == friendship.FriendId) ||
                    (f.UserId == friendship.FriendId && f.FriendId == friendship.UserId)
                );

            if (existingFriendship != null)
            {
                existingFriendship.Status = friendship.Status;

                _context.Entry(existingFriendship).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return existingFriendship;
            }
            return null;
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
