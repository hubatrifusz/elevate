using Elevate.Models.User;
using Elevate.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserCreateDto userCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResultWithUser resultWithUser = await _userService.AddUserAsync(userCreateDto);

            return resultWithUser.User;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserIdWithJWT>> Login([FromBody] LoginRequest model)
        {
            if (!ModelState.IsValid)
            {
            return BadRequest(ModelState);
            }

            UserDto user = await _userService.GetUserByEmailAsync(model.Email);

            return await _userService.SignInAsync(user, model.Password, lockoutOnFailure: false);  
        }
    }
}
