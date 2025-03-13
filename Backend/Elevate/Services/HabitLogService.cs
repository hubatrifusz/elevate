using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public class HabitLogService(HabitLogRepository habitLogRepository, IMapper mapper) : IHabitLogService
    {
        private readonly HabitLogRepository _habitLogRepository = habitLogRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<HabitLogDto>> GetHabitLogsByHabitIdAsync(Guid habitId, int pageNumber, int pageSize)
        {
            List<HabitLogDto> habitLogDtos = [];
            List<HabitLogModel> habitLogModels = await _habitLogRepository.GetHabitLogsByHabitIdAsync(habitId, pageNumber, pageSize);
            foreach (var habitLogModel in habitLogModels)
            {
                habitLogDtos.Add(_mapper.Map<HabitLogDto>(habitLogModel));
            }
            return habitLogDtos;
        }

        public HabitLogModel? GetHabitLogById(Guid habitLogId)
        {
            return _habitLogRepository.GetHabitLogById(habitLogId);
        }

        public async Task<List<HabitLogDto>?> GetHabitLogsByDueDateAsync(Guid userId, DateTime dueDate)
        {
            List<HabitLogModel> habitLogModels = await _habitLogRepository.GetHabitLogsByDueDateAsync(userId, dueDate);
            List<HabitLogDto> habitLogDtos = new();
            foreach (HabitLogModel habitLogModel in habitLogModels)
            {
                habitLogDtos.Add(_mapper.Map<HabitLogDto>(habitLogModel));
            }
            return habitLogDtos;
        }

        public HabitLogModel? AddHabitLog(HabitLogCreateDto habitLog)   //??
        {
            var habitLogModel = _mapper.Map<HabitLogModel>(habitLog);
            return _habitLogRepository.AddHabitLog(habitLogModel);
        }

        public HabitLogModel? UpdateHabitLog(Guid id, HabitLogUpdateDto habitLogUpdateDto)
        {
            var habitLogModel = _habitLogRepository.GetHabitLogById(id)
                ?? throw new Exception("Habit log not found");

            _mapper.Map(habitLogUpdateDto, habitLogModel);

            return _habitLogRepository.UpdateHabitLog(id, habitLogModel);
        }

        public HabitLogModel? DeleteHabitLog(Guid habitLogId)
        {
            return _habitLogRepository.DeleteHabitLog(habitLogId);
        }
    }
}

