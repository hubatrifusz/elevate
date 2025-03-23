using Elevate.Models.Challenge;
using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IChallengeService
    {
        Task<List<UserDto>> GetChallengeInvitesAsync(Guid userId);
        Task<ChallengeDto> AddChallengeAsync(ChallengeCreateDto challengeCreateDto);
        Task<ChallengeDto> UpdateChallengeAsync(ChallengeUpdateDto challengeUpdateDto);
        Task<ChallengeDto> DeleteChallengeAsync(Guid habitId);
    }
}
