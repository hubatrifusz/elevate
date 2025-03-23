using Elevate.Models.Challenge;

namespace Elevate.Services
{
    public interface IChallengeService
    {
        Task<List<ChallengeDto>> GetChallengeInvitesAsync(Guid userId);
        Task<ChallengeDto> AddChallengeAsync(ChallengeCreateDto challengeCreateDto);
        Task<ChallengeDto> UpdateChallengeAsync(ChallengeUpdateDto challengeUpdateDto);
        Task<ChallengeDto> DeleteChallengeAsync(Guid userId, Guid friendId);
    }
}
