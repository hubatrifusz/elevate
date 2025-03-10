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

        public async Task<List<HabitModel>?> GetHabitsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            return await _habitRepository.GetHabitsByUserIdAsync(userId, pageNumber, pageSize);
        }

        public async Task<HabitModel?> GetHabitByIdAsync(Guid habitId)
        {
            return await _habitRepository.GetHabitByIdAsync(habitId);
        }

        public async Task<HabitDto?> AddHabitAsync(HabitCreateDto habit)
        {
            var habitModel = _mapper.Map<HabitModel>(habit);
            HabitModel savedHabit = await _habitRepository.AddHabitAsync(habitModel)!;

            await _habitLogGeneratorService.GenerateLogsForHabitAsync(savedHabit);

            return _mapper.Map<HabitDto>(savedHabit);
        }

        public async Task<HabitModel?> UpdateHabitAsync(Guid id, HabitUpdateDto habitUpdateDto)
        {
            HabitModel habitModel = await _habitRepository.GetHabitByIdAsync(id)
                ?? throw new Exception("Habit not found");

            _mapper.Map(habitUpdateDto, habitModel);

            return _habitRepository.UpdateHabitAsync(id, habitModel).Result;
        }

        public async Task<HabitModel?> DeleteHabitAsync(Guid habitId)
        {
            return await _habitRepository.DeleteHabitAsync(habitId);
        }
    }
}
