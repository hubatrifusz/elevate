using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.Habit;
using System.Threading.Tasks;

namespace Elevate.Services
{
    public class HabitService(HabitRepository habitRepository, IHabitLogGeneratorService habitLogGeneratorService, IMapper mapper) : IHabitService
    {
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly IHabitLogGeneratorService _habitLogGeneratorService = habitLogGeneratorService;
        private readonly IMapper _mapper = mapper;

        public async Task<List<HabitDto>?> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            List<HabitDto> habitDtos = new List<HabitDto>();
            List<HabitModel> habitModels = await _habitRepository.GetHabitsByUserIdAsync(userId, pageNumber, pageSize);
            foreach (var habitModel in habitModels)
            {
                habitDtos.Add(_mapper.Map<HabitDto>(habitModel));
            }
            return habitDtos;
        }

        public async Task<HabitDto?> GetHabitByIdAsync(Guid habitId)
        {
            HabitModel habitModel = await _habitRepository.GetHabitByIdAsync(habitId);
            return _mapper.Map<HabitDto>(habitModel);
        }

        public async Task<HabitDto?> AddHabitAsync(HabitCreateDto habit)
        {
            var habitModel = _mapper.Map<HabitModel>(habit);
            HabitModel savedHabit = await _habitRepository.AddHabitAsync(habitModel)!;

            await _habitLogGeneratorService.GenerateLogsForHabitAsync(savedHabit);

            return _mapper.Map<HabitDto>(savedHabit);
        }

        public async Task<HabitDto?> UpdateHabitAsync(Guid id, HabitUpdateDto habitUpdateDto)
        {
            HabitModel habitModel = await _habitRepository.GetHabitByIdAsync(id)
                ?? throw new Exception("Habit not found");

            _mapper.Map(habitUpdateDto, habitModel);

            var updatedHabit = _habitRepository.UpdateHabitAsync(id, habitModel).Result;

            return _mapper.Map<HabitDto>(updatedHabit);
        }

        public async Task<HabitDto?> DeleteHabitAsync(Guid habitId)
        {
            HabitModel habitModel = await _habitRepository.DeleteHabitAsync(habitId);

            return _mapper.Map<HabitDto>(habitModel);
        }
    }
}
