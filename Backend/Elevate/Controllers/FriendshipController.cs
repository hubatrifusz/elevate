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
        public async Task<ActionResult<List<UserDto>>> GetFriendsAsync(Guid userId)
        {
            List<UserDto> friends = await _friendshipService.GetFriendsAsync(userId);
            return Ok(friends);
        }

        [HttpGet("{userId:guid}/friend-requests")]
        public async Task<ActionResult<List<UserDto>>> GetFriendRequestsAsync(Guid userId)
        {
            UserPermissionUtility.IsCurrentUser(userId, User);
            List<UserDto> friendRequests = await _friendshipService.GetFriendRequestsAsync(userId);
            return Ok(friendRequests);
        }

        [HttpPost]
        public async Task<ActionResult<FriendshipDto>> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto)
        {
            UserPermissionUtility.IsCurrentUser(friendshipCreateDto.UserId, User);
            FriendshipDto friendship = await _friendshipService.AddFriendshipAsync(friendshipCreateDto);

            return friendship;
        }

        [HttpPatch]
        public async Task<ActionResult<FriendshipDto>> UpdateFriendshipAsync(FriendshipUpdateDto friendshipUpdateDto)
        {
            UserPermissionUtility.IsCurrentUser(friendshipUpdateDto.UserId, User);
            FriendshipDto friendship = await _friendshipService.UpdateFriendshipAsync(friendshipUpdateDto);

            return friendship;
        }

        [HttpDelete]
        public async Task<ActionResult<FriendshipDto>> DeleteFriendshipAsync(Guid userId, Guid friendId)
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
