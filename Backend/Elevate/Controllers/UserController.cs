using Elevate.Models.User;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(UserService userService) : ControllerBase
    {
        private readonly UserService _userService = userService;

        [HttpGet]
        private ActionResult<IEnumerable<UserModel>> GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            var users = _userService.GetUsersByEmail(email, pageNumber, pageSize);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<UserModel> GetUserById(Guid id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public ActionResult<UserModel> AddUser(UserCreateDto userCreateDto)
        {
            var createdUser = _userService.AddUser(userCreateDto);
            if (createdUser == null)
            {
                return BadRequest("User could not be created.");
            }
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }

        [HttpPatch("{id}")]
        public ActionResult<UserModel> UpdateUser(Guid id, UserUpdateDto userUpdateDto)
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
        public ActionResult<UserModel> DeleteUser(Guid id)
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
