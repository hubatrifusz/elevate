using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.Habit;

namespace Elevate.Services
{
    public class HabitService(HabitRepository habitRepository, IHabitLogGeneratorService habitLogGeneratorService, IMapper mapper) : IHabitService
    {
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly IHabitLogGeneratorService _habitLogGeneratorService = habitLogGeneratorService;
        private readonly IMapper _mapper = mapper;

        public async Task<List<HabitDto>> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            List<HabitModel> habitModels = await _habitRepository.GetHabitsByUserIdAsync(userId, pageNumber, pageSize);
            return habitModels.Count == 0
                ? throw new ResourceNotFoundException("User has no recorded habits.")
                : _mapper.Map<List<HabitDto>>(habitModels);
        }

        public async Task<HabitDto> GetHabitByIdAsync(Guid habitId)
        {
            HabitModel habitModel = await _habitRepository.GetHabitByIdAsync(habitId)
                ?? throw new ResourceNotFoundException("Habit was not found.");
            return _mapper.Map<HabitDto>(habitModel);
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
            HabitModel habitModel = _mapper.Map<HabitModel>(habitUpdateDto);
                       habitModel.Id = id;

            HabitModel updatedHabit = await _habitRepository.
                UpdateHabitAsync(habitModel)
                ?? throw new BadRequestException("Failed to update habit.");

            return _mapper.Map<HabitDto>(updatedHabit);
        }

        public async Task<HabitDto> DeleteHabitAsync(HabitDto habit)
        {
            HabitModel habitToDelete = _mapper.Map<HabitModel>(habit);

            HabitModel habitModel = await _habitRepository.DeleteHabitAsync(habitToDelete)
                ?? throw new BadRequestException("Failed to delete habit.");

            return _mapper.Map<HabitDto>(habitModel);
        }
    }
}
