using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public class HabitLogService(HabitLogRepository habitLogRepository, IStreakService streakService, IMapper mapper) : IHabitLogService
    {
        private readonly HabitLogRepository _habitLogRepository = habitLogRepository;
        private readonly IStreakService _streakService = streakService;
        private readonly IMapper _mapper = mapper;

        public async Task<List<HabitLogDto>> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize)
        {
            List<HabitLogModel> habitLogModels = await _habitLogRepository.GetHabitLogsByHabitIdAsync(habitId, pageNumber, pageSize);
            return habitLogModels.Count == 0
                ? throw new ResourceNotFoundException("No log was found for the provided habit.")
                : _mapper.Map<List<HabitLogDto>>(habitLogModels);   
        }

        public async Task<HabitLogDto> GetHabitLogByIdAsync(Guid habitLogId)
        {
            HabitLogModel habitLogModel = await _habitLogRepository.GetHabitLogByIdAsync(habitLogId)
                ?? throw new ResourceNotFoundException("Habit log was not found.");

            return _mapper.Map<HabitLogDto>(habitLogModel);
        }

        public async Task<List<HabitLogDto>> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate)
        {
            List<HabitLogModel> habitLogModels = await _habitLogRepository.GetHabitLogsByDueDateAsync(userId, dueDate);
            return habitLogModels.Count == 0
                ? throw new ResourceNotFoundException("No habit log was found with the provided due date.")
                : _mapper.Map<List<HabitLogDto>>(habitLogModels);
        }

        public async Task<HabitLogDto> UpdateHabitLogAsync(HabitLogDto habitLog, HabitLogUpdateDto habitLogUpdateDto)
        {
            HabitLogModel existingHabitLog = await _habitLogRepository.GetHabitLogByIdAsync(habitLog.Id)
                ?? throw new ResourceNotFoundException("Habit log was not found.");

            HabitLogModel habitLogModel = _mapper.Map<HabitLogModel>(existingHabitLog);

            if (habitLogUpdateDto.Completed.HasValue && habitLogUpdateDto.Completed.Value && !existingHabitLog.Completed)
            {
                _mapper.Map(habitLogUpdateDto, habitLogModel);
                await _streakService.UpdateStreakForHabitLog(habitLogModel);
                habitLogModel.CompletedAt = DateTime.Now;
            }

            HabitLogModel updatedHabitLog = await _habitLogRepository.UpdateHabitLogAsync(habitLogModel)
                ?? throw new BadRequestException("Failed to update habit log.");

            return _mapper.Map<HabitLogDto>(updatedHabitLog);
        }

        public async Task<HabitLogDto> DeleteHabitLogAsync(HabitLogDto habitLog)
        {
            HabitLogModel habitLogToDelete = _mapper.Map<HabitLogModel>(habitLog);
            habitLogToDelete.Deleted = true;

            HabitLogModel? habitLogModel = await _habitLogRepository.UpdateHabitLogAsync(habitLogToDelete);

            return habitLogModel == null
                ? throw new BadRequestException("Failed to delete habit log.")
                : _mapper.Map<HabitLogDto>(habitLogModel);
        }
    }
}

