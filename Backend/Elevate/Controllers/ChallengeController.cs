using Elevate.Common.Utilities;
using Elevate.Models.Challenge;
using Elevate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChallengeController(IChallengeService challengeService) : ControllerBase
    {
        private readonly IChallengeService _challengeService = challengeService;

        [HttpGet("{userId:guid}/challenge-invites")]
        public async Task<ActionResult<List<ChallengeDto>>> GetChallengeInvitesAsync(Guid userId)
        {
            UserPermissionUtility.IsCurrentUser(userId, User);
            List<ChallengeDto> challengeInvites = await _challengeService.GetChallengeInvitesAsync(userId);
            return Ok(challengeInvites);
        }

        [HttpPost]
        public async Task<ActionResult<ChallengeDto>> AddChallengeAsync(ChallengeCreateDto challengeCreateDto)
        {
            UserPermissionUtility.IsCurrentUser(challengeCreateDto.UserId, User);
            ChallengeDto challenge = await _challengeService.AddChallengeAsync(challengeCreateDto);

            return CreatedAtAction(nameof(GetChallengeInvitesAsync), new { userId = challenge.UserId }, challenge);
        }

        [HttpPatch]
        public async Task<ActionResult<ChallengeDto>> UpdateChallengeAsync(ChallengeUpdateDto challengeUpdateDto)
        {
            UserPermissionUtility.IsCurrentUser(challengeUpdateDto.UserId, User);
            ChallengeDto challenge = await _challengeService.UpdateChallengeAsync(challengeUpdateDto);

            return CreatedAtAction(nameof(GetChallengeInvitesAsync), new { userId = challenge.UserId }, challenge);
        }

        [HttpDelete]
        public async Task<ActionResult<ChallengeDto>> DeleteChallengeAsync(Guid userId, Guid friendId)
        {
            UserPermissionUtility.IsCurrentUser(userId, User);
            ChallengeDto deletedChallenge = await _challengeService.DeleteChallengeAsync(userId, friendId);
            return Ok(deletedChallenge);
        }
    }
}
