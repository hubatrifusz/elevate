using Elevate.Common.Utilities;
using Elevate.Models.HabitLog;
using Elevate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HabitLogController(IHabitLogService habitLogService) : ControllerBase
    {
        private readonly IHabitLogService _habitLogService = habitLogService;

        [HttpGet]
        public async Task<IActionResult> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize)
        {
            try
            {
                List<HabitLogDto> result = await _habitLogService.GetHabitLogsByHabitIdAsync(habitId, pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public ActionResult<HabitLogModel> GetHabitLogById(Guid id)
        {
            var habitLog = _habitLogService.GetHabitLogById(id);
            if (habitLog != null)
            {
                if(UserPermissionUtility.IsCurrentUser(habitLog.UserId, User))
                {
                    return Ok(habitLog);
                }
                return Forbid();
            }
            return NotFound();
        }

        [HttpGet("duedate/{dueDate}")]
        public async Task<ActionResult<List<HabitLogDto>>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate)
        {
            if (UserPermissionUtility.IsCurrentUser(userId, User))
            {
                List<HabitLogDto> habitLogs = await _habitLogService.GetHabitLogsByDueDateAsync(userId, dueDate);
                return Ok(habitLogs);
            }
            return Forbid();
        }

        [HttpPatch("{id}")]
        public ActionResult<HabitLogModel> UpdateHabitLog(Guid id, HabitLogUpdateDto habitLogUpdateDto)
        {
            var habitLog = _habitLogService.GetHabitLogById(id);
            if (habitLog != null)
            {
                if(UserPermissionUtility.IsCurrentUser(habitLog.UserId, User))
                {
                    try
                    {
                        var updatedHabitLog = _habitLogService.UpdateHabitLog(id, habitLogUpdateDto);
                        return Ok(updatedHabitLog);
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
        public ActionResult<HabitLogModel> DeleteHabitLog(Guid id)
        {
            var habitLog = _habitLogService.GetHabitLogById(id);
            if (habitLog != null)
            {
                if(UserPermissionUtility.IsCurrentUser(habitLog.UserId, User))
                {
                    var deletedHabitLog = _habitLogService.DeleteHabitLog(id);
                    return Ok(deletedHabitLog);
                }
                return Forbid();
            }
            return NotFound();
        }
    }
}
