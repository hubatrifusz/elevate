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
        public async Task<ActionResult<List<UserDto>>> GetUsersByEmailAsync(string email, int pageNumber, int pageSize)
        {
            List<UserDto> users = await _userService.GetUsersByEmailAsync(email, pageNumber, pageSize);
            return Ok(users);
        }

        [HttpGet("{id}", Name = "GetUserByIdAsyncRoute")]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(Guid id)
        {
            UserDto user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUserAsync(Guid id, UserUpdateDto userUpdateDto)
        {
            UserDto user = await _userService.GetUserByIdAsync(id);
            UserPermissionUtility.IsCurrentUser(user.Id, User);
            UserDto updatedUser = await _userService.UpdateUserAsync(id, userUpdateDto);
            return Ok(updatedUser);
        }
    }
}
