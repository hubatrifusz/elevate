using Elevate.Models.User;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

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
        public ActionResult<ApplicationUser> AddUser(UserCreateDto userCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = _userService.AddUser(userCreateDto);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
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
