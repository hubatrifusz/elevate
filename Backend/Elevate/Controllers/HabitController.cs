using Elevate.Common.Utilities;
using Elevate.Models.Habit;
using Elevate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HabitController(IHabitService habitService) : ControllerBase
    {
        private readonly IHabitService _habitService = habitService;

        [HttpGet]
        public async Task<IActionResult> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            var habits = await _habitService.GetHabitsByUserIdAsync(userId, pageNumber, pageSize);
            if (habits != null)
            {
                if (UserPermissionUtility.IsCurrentUser(userId, User))
                {
                    return Ok(habits);
                }
                return Forbid();
            }
            return NotFound();
        }

        [HttpGet("{id}", Name = "GetHabitByIdAsync")]
        public async Task<IActionResult> GetHabitByIdAsync(Guid id)
        {
            var habit = await _habitService.GetHabitByIdAsync(id);
            if (habit != null)
            {
                if (UserPermissionUtility.IsCurrentUser(habit.UserId, User))
                {
                    return Ok(habit);
                }
                return Forbid();
            }
            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> AddHabitAsync(HabitCreateDto habitCreateDto)
        {
            if (UserPermissionUtility.IsCurrentUser(habitCreateDto.UserID, User))
            {
                try
                {
                    HabitDto? createdHabit = await _habitService.AddHabitAsync(habitCreateDto);

                    return CreatedAtRoute(nameof(GetHabitByIdAsync), new { id = createdHabit?.Id }, createdHabit);
                }
                catch (Exception ex)
                {
                    return BadRequest("Could not create object" + ex.Message);
                }
            }
            return Forbid();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateHabitAsync(Guid id, HabitUpdateDto habitUpdateDto)
        {
            var habit = await _habitService.GetHabitByIdAsync(id);
            if (habit != null)
            {
                if (UserPermissionUtility.IsCurrentUser(habit.UserId, User))
                {
                    try
                    {
                        var updatedHabit = await _habitService.UpdateHabitAsync(id, habitUpdateDto);
                        if (updatedHabit == null)
                        {
                            return NotFound();
                        }
                        return Ok(updatedHabit);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Could not create object" + ex.Message);
                    }
                }
                return Forbid();
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabitAsync(Guid id)
        {
            var habit = await _habitService.GetHabitByIdAsync(id);
            if (habit != null)
            {
                if (UserPermissionUtility.IsCurrentUser(habit.UserId, User))
                {
                    var deletedHabit = await _habitService.DeleteHabitAsync(id);
                    return Ok(deletedHabit);
                }
                return Forbid();
            }
            return NotFound();
        }
    }
}
