using AutoMapper;
using Elevate.Models.User;
using Elevate.Common.Utilities;
using Elevate.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(
        IUserService userService,
        IMapper mapper,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration
    ) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;
        private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
        private readonly IConfiguration _configuration = configuration;
        private readonly JwtUtility _jwtUtility = new(configuration);

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserCreateDto userCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResultWithUser resultWithUser = await _userService.AddUserAsync(userCreateDto);

            if (resultWithUser.Result != null)
            {
                if (resultWithUser.Result.Succeeded)
                {
                    var userDto = _mapper.Map<UserDto>(resultWithUser.User);
                    return CreatedAtRoute(
                        "GetUserByIdAsyncRoute",
                        new { id = userDto.Id },
                        userDto
                    );
                }
                else
                {
                    foreach (var error in resultWithUser.Result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userService.GetUserByEmailAsync(model.Email);
                if (user != null)
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        var claims = new List<Claim>
                        {
                            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new(ClaimTypes.Email, user.Email ?? string.Empty)
                        };

                        var token = _jwtUtility.GenerateJwtRsa(claims);
                        return Ok(new { token });
                    }
                }

                return Unauthorized(new { message = "Invalid login attempt" });
            }
            return BadRequest(ModelState);
        }
    }
}
