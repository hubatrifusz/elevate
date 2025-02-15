using Elevate.Models.User;
using Elevate.Models.Friendship;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
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
            var friendship = await _friendshipService.AddFriendshipAsync(friendshipCreateDto);
            if (friendship == null)
            {
                return BadRequest("Friendship could not be established.");
            }
            return CreatedAtAction(nameof(GetFriends), new { userId = friendship.UserId }, friendship);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFriendship(Guid userId, Guid friendId)
        {
            var result = await _friendshipService.DeleteFriendshipAsync(userId, friendId);
            if (result == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
