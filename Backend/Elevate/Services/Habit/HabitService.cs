using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.Challenge;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.NegativeHabit;
using Elevate.Services.HabitLog;

namespace Elevate.Services.Habit
{
    public class HabitService(
        HabitRepository habitRepository, 
        HabitLogRepository habitLogRepository,
        ChallengeRepository challengeRepository,
        IHabitLogGeneratorService habitLogGeneratorService, 
        IMapper mapper)
        : IHabitService
    {
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly HabitLogRepository _habitLogRepository = habitLogRepository;
        private readonly ChallengeRepository _challengeRepository = challengeRepository;
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
            await _challengeRepository.DeleteChallengesForHabitAsync(habitToDelete.Id);

            HabitModel? habitModel = await _habitRepository.UpdateHabitAsync(habitToDelete);

            return habitModel == null
                ? throw new BadRequestException("Failed to delete habit.")
                : _mapper.Map<HabitDto>(habitModel);
        }

        public async Task<List<NegativeHabitDto>> GetNegativeHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            List<NegativeHabitModel> habitModels = await _habitRepository.GetNegativeHabitsByUserIdAsync(userId, pageNumber, pageSize);

            if (habitModels.Count == 0)
            {
                if (pageNumber == 1)
                {
                    throw new ResourceNotFoundException("User has no negative habits.");
                }
                throw new ResourceNotFoundException("User has no more negative habits.");
            }
            return _mapper.Map<List<NegativeHabitDto>>(habitModels);
        }

        public async Task<NegativeHabitDto> GetNegativeHabitByIdAsync(Guid habitId)
        {
            NegativeHabitModel? habitModel = await _habitRepository.GetNegativeHabitByIdAsync(habitId);
            return habitModel == null
                ? throw new ResourceNotFoundException("Negative habit was not found.")
                : _mapper.Map<NegativeHabitDto>(habitModel);
        }

        public async Task<NegativeHabitDto> AddNegativeHabitAsync(NegativeHabitCreateDto habit)
        {
            NegativeHabitModel habitModel = _mapper.Map<NegativeHabitModel>(habit);
            NegativeHabitModel savedHabit = await _habitRepository.AddNegativeHabitAsync(habitModel)
                ?? throw new BadRequestException("Failed to create negative habit.");

            return _mapper.Map<NegativeHabitDto>(savedHabit);
        }

        public async Task<NegativeHabitDto> UpdateNegativeHabitAsync(Guid id)
        {
            NegativeHabitModel existingHabit = await _habitRepository.GetNegativeHabitByIdAsync(id)
                ?? throw new ResourceNotFoundException("Negative habit was not found.");

            NegativeHabitModel habitModel = _mapper.Map<NegativeHabitModel>(existingHabit);
            habitModel.UpdatedAt = DateTime.UtcNow;

            NegativeHabitModel updatedHabit = await _habitRepository.UpdateNegativeHabitAsync(habitModel)
                ?? throw new BadRequestException("Failed to update negative habit.");

            return _mapper.Map<NegativeHabitDto>(updatedHabit);
        }

        public async Task<NegativeHabitDto> DeleteNegativeHabitAsync(NegativeHabitDto habit)
        {
            NegativeHabitModel habitToDelete = _mapper.Map<NegativeHabitModel>(habit);

            habitToDelete.Deleted = true;

            NegativeHabitModel? habitModel = await _habitRepository.UpdateNegativeHabitAsync(habitToDelete);

            return habitModel == null
                ? throw new BadRequestException("Failed to delete negative habit.")
                : _mapper.Map<NegativeHabitDto>(habitModel);
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
