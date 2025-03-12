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
    public class FriendshipController(IFriendshipService friendshipService, IUserService userService) : ControllerBase
    {
        private readonly IFriendshipService _friendshipService = friendshipService;
        private readonly IUserService _userService = userService;

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
                if (await _userService.GetUserByIdAsync(friendshipCreateDto.FriendId) == null)
                {
                    return NotFound("No user found with given Id.");
                }
                var friends = await _friendshipService.GetFriendsAsync(userId);
                if (friends.Any(f => f.Id == friendshipCreateDto.FriendId))
                {
                    return BadRequest("Already friends.");
                }
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
                if (!_friendshipService.GetFriendsAsync(userId).Result.Contains(_userService.GetUserByIdAsync(friendId).Result))
                {
                    return NotFound("Users are not friends.");
                }
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
