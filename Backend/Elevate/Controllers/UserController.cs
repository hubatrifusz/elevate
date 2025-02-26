using Elevate.Models.User;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Elevate.Common.Utilities;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet]
        public ActionResult<IEnumerable<ApplicationUser>> GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            var users = _userService.GetUsersByEmailAsync(email, pageNumber, pageSize);
            return Ok(users);
        }

        [HttpGet("{id}", Name = "GetUserByIdAsyncRoute")]
        public async Task<ActionResult<ApplicationUser>> GetUserByIdAsync(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ApplicationUser>> UpdateUserAsync(Guid id, UserUpdateDto userUpdateDto)
        {
            if (UserPermissionUtility.IsCurrentUser(id, User))
            {
                try
                {
                    var updatedUser = await _userService.UpdateUserAsync(id, userUpdateDto);
                    if (updatedUser == null)
                    {
                        return NotFound();
                    }
                    return NoContent();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return Forbid();
            }
        }
    }
}
