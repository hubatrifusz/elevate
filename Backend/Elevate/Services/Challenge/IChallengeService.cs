using Elevate.Models.Challenge;

namespace Elevate.Services.Challenge
{
    public interface IChallengeService
    {
        Task<List<ChallengeDto>> GetChallengeInvitesAsync(Guid userId);
        Task<List<ChallengeDto>> GetSentChallengeInvitesAsync(Guid userId);
        Task<List<ChallengeDto>> GetChallengesByUserIdAsync(Guid userId);
        Task<ChallengeDto> AddChallengeAsync(ChallengeCreateDto challengeCreateDto);
        Task<ChallengeDto> UpdateChallengeAsync(ChallengeUpdateDto challengeUpdateDto);
        Task<ChallengeDto> DeleteChallengeAsync(Guid habitId);
    }
}
