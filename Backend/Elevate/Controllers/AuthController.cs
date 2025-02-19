using AutoMapper;
using Elevate.Models.User;
using Elevate.Services;
using Elevate.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IUserService userService, IMapper mapper, SignInManager<ApplicationUser> signInManager, IConfiguration configuration) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;
        private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
        private readonly IConfiguration _configuration = configuration;

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
                    return CreatedAtAction("GetUserByIdRoute", new { id = userDto.Id }, userDto);
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
                        var token = GenerateJwtToken(user);
                        return Ok(new { token });
                    }
                }

                return Unauthorized(new { message = "Invalid login attempt" });
            }
            return BadRequest(ModelState);
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            if (jwtKey == null)
            {
                throw new Exception("Jwt Key could not be configured");
            }
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //???
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
