using Elevate.Data.Database;
using Elevate.Models.Challenge;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class ChallengeRepository(ElevateDbContext context)
    {
        private readonly ElevateDbContext _context = context;

        public async Task<List<ApplicationUser>> GetChallengeInvitesAsync(Guid userId)
        {
            return await _context.Users
                .Where(u => _context.Challenges.Any(c => c.FriendId == userId && c.UserId == u.Id &&
                  c.Status == ChallengeInviteStatus.Pending))
                .ToListAsync();
        }

        public async Task<ChallengeModel?> AddChallengeAsync(ChallengeModel challenge)
        {
            await _context.Challenges.AddAsync(challenge);
            await _context.SaveChangesAsync();
            return challenge;
        }

        public async Task<ChallengeModel?> UpdateChallengeAsync(ChallengeModel challenge)
        {
            var existingChallenge = await _context.Challenges
                .FirstOrDefaultAsync(c => c.UserId == challenge.UserId && c.FriendId == challenge.FriendId);

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
