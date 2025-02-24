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
        public ActionResult<IEnumerable<HabitModel>> GetHabitsByUserId(Guid userId, int pageNumber, int pageSize)
        {
            var habits = _habitService.GetHabitsByUserId(userId, pageNumber, pageSize);
            return Ok(habits);
        }

        [HttpGet("{id}")]
        public ActionResult<HabitModel> GetHabitById(Guid id)
        {
            var habit = _habitService.GetHabitById(id);
            if (habit == null)
            {
                return NotFound();
            }
            return Ok(habit);
        }

        [HttpPost]
        public ActionResult<HabitModel> AddHabit(HabitCreateDto habitCreateDto)
        {
            var createdHabit = _habitService.AddHabit(habitCreateDto);
            if (createdHabit == null)
            {
                return BadRequest("Habit could not be created.");
            }
            return CreatedAtAction(nameof(GetHabitById), new { id = createdHabit.Id }, createdHabit);
        }

        [HttpPatch("{id}")]
        public ActionResult<HabitModel> UpdateHabit(Guid id, HabitUpdateDto habitUpdateDto)
        {
            try
            {
                var updatedHabit = _habitService.UpdateHabit(id, habitUpdateDto);
                if (updatedHabit == null)
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
        public ActionResult<HabitModel> DeleteHabit(Guid id)
        {
            var deletedHabit = _habitService.DeleteHabit(id);
            if (deletedHabit == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
