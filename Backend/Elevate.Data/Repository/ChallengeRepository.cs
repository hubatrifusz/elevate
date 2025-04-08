using Elevate.Data.Database;
using Elevate.Models.Challenge;
using Elevate.Models.Friendship;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class ChallengeRepository(ElevateDbContext context)
    {
        private readonly ElevateDbContext _context = context;

        public async Task<List<ChallengeModel>> GetChallengeInvitesAsync(Guid userId)
        {
            return await _context.Challenges
                .Include(c => c.Habit)
                .Where(c => c.FriendId == userId &&
                  c.Status == ChallengeInviteStatus.Pending)
                .ToListAsync();
        }

        public async Task<List<ChallengeModel>> GetSentChallengeInvitesAsync(Guid userId)
        {
            return await _context.Challenges
                .Include(c => c.Habit)
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<ChallengeModel>> GetChallengesByUserIdAsync(Guid userId)
        {
            return await _context.Challenges
                .Include(c => c.Habit)
                .Where(c => c.Habit.ChallengedFriends.Contains(userId) &&
                    c.Status == ChallengeInviteStatus.Accepted)
                .ToListAsync();
        }

        public async Task<bool> IsChallengeRequestSent(Guid userId, Guid friendId, Guid habitId)
        {
            return await _context.Challenges
                .Include(c => c.Habit)
                .AnyAsync(c =>
                    c.UserId == userId && c.FriendId == friendId &&
                    c.Habit.Id == habitId &&
                    c.Status == ChallengeInviteStatus.Pending
                );
        }

        public async Task<ChallengeModel?> AddChallengeAsync(ChallengeModel challenge)
        {
            await _context.Challenges.AddAsync(challenge);
            await _context.SaveChangesAsync();
            return await _context.Challenges.SingleAsync(c => c.Id == challenge.Id);
        }

        public async Task<ChallengeModel?> UpdateChallengeAsync(ChallengeModel challenge)
        {
            var existingChallenge = await _context.Challenges
                .Include(c => c.Habit)
                .FirstOrDefaultAsync(c => 
                c.UserId == challenge.UserId && 
                c.FriendId == challenge.FriendId &&
                c.Habit.Id == challenge.Habit.Id);

            if (existingChallenge != null)
            {
                existingChallenge.Status = challenge.Status;
                _context.Entry(existingChallenge).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return existingChallenge;
            }
            return null;
        }

        public async Task<ChallengeModel?> DeleteChallengeAsync(Guid challengeId)
        {
            var challenge = await _context.Challenges
                .Include(c => c.Habit)
                .FirstOrDefaultAsync(c => c.Id == challengeId);

            if (challenge != null)
            {
                _context.Habits.Single(h => h.Id == challenge.Habit.Id)
                   .Deleted = true;
                _context.Challenges.Remove(challenge);
                await _context.SaveChangesAsync();
                return challenge;
            }
            return null;
        }
    }
}
