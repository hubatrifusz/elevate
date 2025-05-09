﻿using Elevate.Common.Utilities;
using Elevate.Models.HabitLog;
using Elevate.Services.HabitLog;
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
        public async Task<ActionResult<HabitLogDto>> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize)
        {
            List<HabitLogDto> result = await _habitLogService.GetHabitLogsByHabitIdAsync(habitId, pageNumber, pageSize);
            UserPermissionUtility.IsCurrentUser(result[0].UserId, User);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<List<HabitLogDto>>> GetHabitLogByIdAsync(Guid id)
        {
            var habitLog = await _habitLogService.GetHabitLogByIdAsync(id);
            UserPermissionUtility.IsCurrentUser(habitLog.UserId, User);
            return Ok(habitLog);
        }

        [HttpGet("{dueDate:datetime}")]
        public async Task<ActionResult<List<HabitLogDto>>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate)
        {
            UserPermissionUtility.IsCurrentUser(userId, User);
            List<HabitLogDto> habitLogs = await _habitLogService.GetHabitLogsByDueDateAsync(userId, dueDate);
            return Ok(habitLogs);
        }

        [HttpPatch("{id:guid}")]
        public async Task<ActionResult<HabitLogDto>> UpdateHabitLogAsync(Guid id, HabitLogUpdateDto habitLogUpdateDto)
        {
            HabitLogDto habitLog = await _habitLogService.GetHabitLogByIdAsync(id);
            UserPermissionUtility.IsCurrentUser(habitLog.UserId, User);
            HabitLogDto updatedHabitLog = await _habitLogService.UpdateHabitLogAsync(habitLog, habitLogUpdateDto);
            return Ok(updatedHabitLog);
        }
    }
}
