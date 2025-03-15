using Elevate.Models.Friendship;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Elevate.Common.Utilities;
using Elevate.Models.User;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendshipController(IFriendshipService friendshipService) : ControllerBase
    {
        private readonly IFriendshipService _friendshipService = friendshipService;

        [HttpGet("{userId:guid}/friends")]
        public async Task<ActionResult<List<UserDto>>> GetFriends(Guid userId)
        {
            List<UserDto> friends = await _friendshipService.GetFriendsAsync(userId);
            return Ok(friends);
        }

        [HttpPost]
        public async Task<ActionResult<FriendshipDto>> AddFriendship(FriendshipCreateDto friendshipCreateDto)
        {
            UserPermissionUtility.IsCurrentUser(friendshipCreateDto.UserId, User);
            FriendshipDto friendship = await _friendshipService.AddFriendshipAsync(friendshipCreateDto);

            return CreatedAtAction(nameof(GetFriends), new { userId = friendship.UserId }, friendship);
        }

        [HttpDelete]
        public async Task<ActionResult<FriendshipDto>> DeleteFriendship(Guid userId, Guid friendId)
        {
            try
            {
                UserPermissionUtility.IsCurrentUser(userId, User);
            }
            catch
            {
                UserPermissionUtility.IsCurrentUser(friendId, User);
            }

            FriendshipDto deletedFriendship = await _friendshipService.DeleteFriendshipAsync(userId, friendId);
            return Ok(deletedFriendship);
        }
    }
}
