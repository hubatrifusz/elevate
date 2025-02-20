using Elevate.Models.HabitLog;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitLogController(IHabitLogService habitLogService) : ControllerBase
    {
        private readonly IHabitLogService _habitLogService = habitLogService;

        [HttpGet]
        public ActionResult<IEnumerable<HabitLogModel>> GetHabitLogsByHabitId(Guid id, int pageNumber, int pageSize)
        {
            var habitLogs = _habitLogService.GetHabitLogsByHabitId(id, pageNumber, pageSize);
            return Ok(habitLogs);
        }

        [HttpGet("{id}")]
        public ActionResult<HabitLogModel> GetHabitLogById(Guid id)
        {
            var habitLog = _habitLogService.GetHabitLogById(id);
            if (habitLog == null)
            {
                return NotFound();
            }
            return Ok(habitLog);
        }

        [HttpPatch("{id}")]
        public ActionResult<HabitLogModel> UpdateHabitLog(Guid id, HabitLogUpdateDto habitLogUpdateDto)
        {
            try
            {
                var updatedHabitLog = _habitLogService.UpdateHabitLog(id, habitLogUpdateDto);
                if (updatedHabitLog == null)
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
        public ActionResult<HabitLogModel> DeleteHabitLog(Guid id)
        {
            var deletedHabitLog = _habitLogService.DeleteHabitLog(id);
            if (deletedHabitLog == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
