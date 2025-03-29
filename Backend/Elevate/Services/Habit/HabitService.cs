using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Services.HabitLog;

namespace Elevate.Services.Habit
{
    public class HabitService(
        HabitRepository habitRepository, 
        HabitLogRepository habitLogRepository, 
        IHabitLogGeneratorService habitLogGeneratorService, 
        IMapper mapper)
        : IHabitService
    {
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly HabitLogRepository _habitLogRepository = habitLogRepository;
        private readonly IHabitLogGeneratorService _habitLogGeneratorService = habitLogGeneratorService;
        private readonly IMapper _mapper = mapper;

        public async Task<List<HabitDto>> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            List<HabitModel> habitModels = await _habitRepository.GetHabitsByUserIdAsync(userId, pageNumber, pageSize);

            if (habitModels.Count == 0)
            {
                if(pageNumber == 1)
                {
                    throw new ResourceNotFoundException("User has no recorded habits.");
                }
                throw new ResourceNotFoundException("User has no more habits.");
            }
            return _mapper.Map<List<HabitDto>>(habitModels);
        }

        public async Task<HabitDto> GetHabitByIdAsync(Guid habitId)
        {
            HabitModel? habitModel = await _habitRepository.GetHabitByIdAsync(habitId);

            return habitModel == null
                ? throw new ResourceNotFoundException("Habit was not found.")
                : _mapper.Map<HabitDto>(habitModel);
        }

        public async Task<HabitDto> AddHabitAsync(HabitCreateDto habit)
        {
            HabitModel habitModel = _mapper.Map<HabitModel>(habit);
            HabitModel savedHabit = await _habitRepository.AddHabitAsync(habitModel)
                ?? throw new BadRequestException("Failed to create habit.");

            await _habitLogGeneratorService.GenerateLogsForHabitAsync(savedHabit);

            return _mapper.Map<HabitDto>(savedHabit);
        }

        public async Task<HabitDto> UpdateHabitAsync(Guid id, HabitUpdateDto habitUpdateDto)
        {
            HabitModel existingHabit = await _habitRepository.GetHabitByIdAsync(id)
                ?? throw new ResourceNotFoundException("Habit was not found.");

            HabitModel habitModel = _mapper.Map<HabitModel>(existingHabit);

            _mapper.Map(habitUpdateDto, habitModel);

            HabitModel updatedHabit = await _habitRepository.UpdateHabitAsync(habitModel)
                ?? throw new BadRequestException("Failed to update habit.");

            return _mapper.Map<HabitDto>(updatedHabit);
        }

        public async Task<HabitDto> DeleteHabitAsync(HabitDto habit)
        {
            HabitModel habitToDelete = _mapper.Map<HabitModel>(habit);

            habitToDelete.Deleted = true;

            await DeleteAllHabitLogsForHabitAsync(habitToDelete.Id);

            HabitModel? habitModel = await _habitRepository.UpdateHabitAsync(habitToDelete);

            return habitModel == null
                ? throw new BadRequestException("Failed to delete habit.")
                : _mapper.Map<HabitDto>(habitModel);
        }

        private async Task DeleteAllHabitLogsForHabitAsync(Guid habitId)
        {
            int pageNumber = 1;
            const int batchSize = 20;
            List<HabitLogModel> habitLogs;

            do
            {
                habitLogs = await _habitLogRepository.GetHabitLogsByHabitIdAsync(habitId, pageNumber, batchSize);

                foreach (var log in habitLogs)
                {
                    log.Deleted = true;
                    await _habitLogRepository.UpdateHabitLogAsync(log);
                }

                pageNumber++;
            }
            while (habitLogs.Count == batchSize);
        }
    }
}
