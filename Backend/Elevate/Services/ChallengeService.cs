using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.Challenge;
using Elevate.Models.Friendship;
using Elevate.Models.Habit;
using Elevate.Models.User;

namespace Elevate.Services
{
    public class ChallengeService(ChallengeRepository challengeRepository, HabitRepository habitRepository, IMapper mapper) : IChallengeService
    {
        private readonly ChallengeRepository _challengeRepository = challengeRepository;
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<UserDto>> GetChallengeInvitesAsync(Guid userId)
        {
            List<ApplicationUser> users = await _challengeRepository.GetChallengeInvitesAsync(userId);

            return users.Count == 0
                ? throw new ResourceNotFoundException("User has no challenge invites.")
                : _mapper.Map<List<UserDto>>(users);
        }

        public async Task<ChallengeDto> AddChallengeAsync(ChallengeCreateDto challengeCreateDto)
        {
            if (challengeCreateDto.UserId == challengeCreateDto.FriendId)
            {
                throw new BadRequestException("User cannot challenge themself.");
            }

            var existingHabit = await _habitRepository.GetHabitByIdAsync(challengeCreateDto.Habit.Id);
            if (existingHabit == null)
            {
                throw new ResourceNotFoundException("Habit not found");
            }

            ChallengeModel challenge = _mapper.Map<ChallengeModel>(challengeCreateDto);
            challenge.Habit = existingHabit;

            ChallengeModel savedChallenge = await _challengeRepository.AddChallengeAsync(challenge)
                ?? throw new BadRequestException("Failed to add challenge.");

            return _mapper.Map<ChallengeDto>(savedChallenge);
        }

        public async Task<ChallengeDto> UpdateChallengeAsync(ChallengeUpdateDto challengeUpdateDto)
        {
            ChallengeModel challengeModel = _mapper.Map<ChallengeModel>(challengeUpdateDto);

            challengeUpdateDto.Habit.ChallengedFriends.Add(challengeUpdateDto.FriendId);

            HabitModel? habitModel = await _habitRepository.UpdateHabitAsync(_mapper.Map<HabitModel>(challengeUpdateDto.Habit));

            ChallengeModel updatedChallenge = await _challengeRepository.UpdateChallengeAsync(challengeModel)
                ?? throw new BadRequestException("Failed to update challenge.");

            return _mapper.Map<ChallengeDto>(updatedChallenge);
        }

        public async Task<ChallengeDto> DeleteChallengeAsync(Guid habitId)
        {
            ChallengeModel challenge = await _challengeRepository.DeleteChallengeAsync(habitId)
                ?? throw new ResourceNotFoundException("Failed to remove challenge.");

            return _mapper.Map<ChallengeDto>(challenge);
        }
    }
}
