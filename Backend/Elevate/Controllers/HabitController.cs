using Elevate.Common.Utilities;
using Elevate.Models.Habit;
using Elevate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HabitController(IHabitService habitService, IHabitLogGeneratorService habitLogGeneratorService) : ControllerBase
    {
        private readonly IHabitService _habitService = habitService;
        private readonly IHabitLogGeneratorService _habitLogGeneratorService = habitLogGeneratorService;

        [HttpGet]
        public ActionResult<IEnumerable<HabitModel>> GetHabitsByUserId(Guid userId, int pageNumber, int pageSize)
        {
            var habits = _habitService.GetHabitsByUserId(userId, pageNumber, pageSize);
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

        [HttpGet("{id}")]
        public ActionResult<HabitModel> GetHabitById(Guid id)
        {
            var habit = _habitService.GetHabitById(id);
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
        public async Task<ActionResult<HabitModel>> AddHabit(HabitCreateDto habitCreateDto)
        {
            if (UserPermissionUtility.IsCurrentUser(habitCreateDto.UserID, User))
            {
                var createdHabit = _habitService.AddHabit(habitCreateDto);
                if (createdHabit == null)
                {
                    return BadRequest("Habit could not be created.");
                }
                await _habitLogGeneratorService.GenerateLogsForHabitAsync(createdHabit);

                return CreatedAtAction(nameof(GetHabitById), new { id = createdHabit.Id }, createdHabit);
            }
            return Forbid();
        }

        [HttpPatch("{id}")]
        public ActionResult<HabitModel> UpdateHabit(Guid id, HabitUpdateDto habitUpdateDto)
        {
            var habit = _habitService.GetHabitById(id);
            if (habit != null)
            {
                if (UserPermissionUtility.IsCurrentUser(habit.UserId, User))
                {
                    try
                    {
                        var updatedHabit = _habitService.UpdateHabit(id, habitUpdateDto);
                        if (updatedHabit == null)
                        {
                            return NotFound();
                        }
                        return Ok(updatedHabit);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                return Forbid();
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public ActionResult<HabitModel> DeleteHabit(Guid id)
        {
            var habit = _habitService.GetHabitById(id);
            if (habit != null)
            {
                if (UserPermissionUtility.IsCurrentUser(habit.UserId, User))
                {
                    var deletedHabit = _habitService.DeleteHabit(id);
                    return Ok(deletedHabit);
                }
                return Forbid();
            }
            return NotFound();
        }
    }
}
