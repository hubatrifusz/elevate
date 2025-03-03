using Elevate.Models.Friendship;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Elevate.Common.Utilities;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendshipController(IFriendshipService friendshipService) : ControllerBase
    {
        private readonly IFriendshipService _friendshipService = friendshipService;

        [HttpGet("{userId}/friends")]
        public async Task<IActionResult> GetFriends(Guid userId)
        {
            var friends = await _friendshipService.GetFriendsAsync(userId);
            return Ok(friends);
        }

        [HttpPost]
        public async Task<IActionResult> AddFriendship(FriendshipCreateDto friendshipCreateDto)
        {
            var userId = friendshipCreateDto.UserId;
            if (UserPermissionUtility.IsCurrentUser(userId, User))
            {
                var friendship = await _friendshipService.AddFriendshipAsync(friendshipCreateDto);
                if (friendship == null)
                {
                    return BadRequest("Friendship could not be established.");
                }
                return CreatedAtAction(nameof(GetFriends), new { userId = friendship.UserId }, friendship); 
            }
            return Forbid();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFriendship(Guid userId, Guid friendId)
        {
            if (UserPermissionUtility.IsCurrentUser(userId, User) 
                || UserPermissionUtility.IsCurrentUser(friendId, User))
            {
                var result = await _friendshipService.DeleteFriendshipAsync(userId, friendId);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            return Forbid();
        }
    }
}
