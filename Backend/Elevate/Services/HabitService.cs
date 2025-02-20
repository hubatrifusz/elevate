using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.Habit;

namespace Elevate.Services
{
    public class HabitService(HabitRepository habitRepository, IMapper mapper) : IHabitService
    {
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        public List<HabitModel>? GetHabitsByUserId(Guid userId, int pageNumber, int pageSize)
        {
            return _habitRepository.GetHabitsByUserId(userId, pageNumber, pageSize);
        }

        public HabitModel? GetHabitById(Guid habitId)
        {
            return _habitRepository.GetHabitById(habitId);
        }

        public HabitModel? AddHabit(HabitCreateDto habit)
        {
            var habitModel = _mapper.Map<HabitModel>(habit);
            return _habitRepository.AddHabit(habitModel);
        }

        public HabitModel? UpdateHabit(Guid id, HabitUpdateDto habitUpdateDto)
        {
            var habitModel = _habitRepository.GetHabitById(id)
                ?? throw new Exception("Habit not found");

            _mapper.Map(habitUpdateDto, habitModel);

            return _habitRepository.UpdateHabit(id, habitModel);
        }

        public HabitModel? DeleteHabit(Guid habitId)
        {
            return _habitRepository.DeleteHabit(habitId);
        }
    }
}
