using AutoMapper;
using Elevate.Models.User;
using Elevate.Services;
using Elevate.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService, IMapper mapper) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public ActionResult<IEnumerable<ApplicationUser>> GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            var users = _userService.GetUsersByEmail(email, pageNumber, pageSize);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<ApplicationUser> GetUserById(Guid id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(UserCreateDto userCreateDto)
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
                    return CreatedAtAction(nameof(GetUserById), new { id = userDto.Id }, userDto);
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

        [HttpPatch("{id}")]
        public ActionResult<ApplicationUser> UpdateUser(Guid id, UserUpdateDto userUpdateDto)
        {
            try
            {
                var updatedUser = _userService.UpdateUser(id, userUpdateDto);
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

        [HttpDelete("{id}")]
        public ActionResult<ApplicationUser> DeleteUser(Guid id)
        {
            var deletedUser = _userService.DeleteUser(id);
            if (deletedUser == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
