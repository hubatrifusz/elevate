using Elevate.Common.Utilities;
using Elevate.Models.Habit;
using Elevate.Services.Habit;
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
        public async Task<ActionResult<List<HabitDto>>> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            UserPermissionUtility.IsCurrentUser(userId, User);
            List<HabitDto> habits = await _habitService.GetHabitsByUserIdAsync(userId, pageNumber, pageSize);
            return Ok(habits);
        }

        [HttpGet("{id:guid}", Name = "GetHabitByIdAsync")]
        public async Task<ActionResult<HabitDto>> GetHabitByIdAsync(Guid id)
        {
            HabitDto habit = await _habitService.GetHabitByIdAsync(id);
            UserPermissionUtility.IsCurrentUser(habit.UserId, User);
            return Ok(habit);
        }

        [HttpPost]
        public async Task<ActionResult<HabitDto>> AddHabitAsync(HabitCreateDto habitCreateDto)
        {
            UserPermissionUtility.IsCurrentUser(habitCreateDto.UserID, User);
            HabitDto createdHabit = await _habitService.AddHabitAsync(habitCreateDto);
            return CreatedAtRoute(nameof(GetHabitByIdAsync), new { id = createdHabit.Id }, createdHabit);
        }

        [HttpPatch("{id:guid}")]
        public async Task<ActionResult<HabitDto>> UpdateHabitAsync(Guid id, HabitUpdateDto habitUpdateDto)
        {
            HabitDto habit = await _habitService.GetHabitByIdAsync(id);
            UserPermissionUtility.IsCurrentUser(habit.UserId, User);
            HabitDto updatedHabit = await _habitService.UpdateHabitAsync(id, habitUpdateDto);
            return Ok(updatedHabit);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<HabitDto>> DeleteHabitAsync(Guid id)
        {
            HabitDto habit = await _habitService.GetHabitByIdAsync(id);
            UserPermissionUtility.IsCurrentUser(habit.UserId, User);
            HabitDto deletedHabit = await _habitService.DeleteHabitAsync(habit);
            return Ok(deletedHabit);
        }
    }
}
