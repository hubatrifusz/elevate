using Elevate.Common.Utilities;
using Elevate.Models.Challenge;
using Elevate.Models.Habit;
using Elevate.Models.User;
using Elevate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChallengeController(IChallengeService challengeService, IHabitService habitService) : ControllerBase
    {
        private readonly IChallengeService _challengeService = challengeService;
        private readonly IHabitService _habitService = habitService;

        [HttpGet("{userId:guid}/challenge-invites")]
        public async Task<ActionResult<List<UserDto>>> GetChallengeInvitesAsync(Guid userId)
        {
            UserPermissionUtility.IsCurrentUser(userId, User);
            List<UserDto> challengeInvites = await _challengeService.GetChallengeInvitesAsync(userId);
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
        public async Task<ActionResult<ChallengeDto>> DeleteChallengeAsync(Guid habitId)
        {
            HabitDto habit = await _habitService.GetHabitByIdAsync(habitId);
            UserPermissionUtility.IsCurrentUser(habit.UserId, User);
            ChallengeDto deletedChallenge = await _challengeService.DeleteChallengeAsync(habitId);
            return Ok(deletedChallenge);
        }
    }
}
