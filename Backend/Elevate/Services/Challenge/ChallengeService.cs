using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.Challenge;
using Elevate.Models.Habit;
using Elevate.Services.HabitLog;

namespace Elevate.Services.Challenge
{
    public class ChallengeService(ChallengeRepository challengeRepository, HabitRepository habitRepository, IHabitLogGeneratorService habitLogGeneratorService, IMapper mapper) : IChallengeService
    {
        private readonly ChallengeRepository _challengeRepository = challengeRepository;
        private readonly HabitRepository _habitRepository = habitRepository;
        private readonly IHabitLogGeneratorService _habitLogGeneratorService = habitLogGeneratorService;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ChallengeDto>> GetChallengeInvitesAsync(Guid userId)
        {
            List<ChallengeModel> challenges = await _challengeRepository.GetChallengeInvitesAsync(userId);

            return challenges.Count == 0
                ? throw new ResourceNotFoundException("User has no challenge invites.")
                : _mapper.Map<List<ChallengeDto>>(challenges);
        }

        public async Task<List<ChallengeDto>> GetSentChallengeInvitesAsync(Guid userId)
        {
            List<ChallengeModel> invites = await _challengeRepository.GetSentChallengeInvitesAsync(userId);

            return invites.Count == 0
                ? throw new ResourceNotFoundException("User sent no challenge invites.")
                : _mapper.Map<List<ChallengeDto>>(invites);
        }

        public async Task<List<ChallengeDto>> GetChallengesByUserIdAsync(Guid userId)
        {
            List<ChallengeModel> challenges = await _challengeRepository.GetChallengesByUserIdAsync(userId);

            return challenges.Count == 0
                ? throw new ResourceNotFoundException("User has no challenges.")
                : _mapper.Map<List<ChallengeDto>>(challenges);
        }

        public async Task<ChallengeDto> AddChallengeAsync(ChallengeCreateDto challengeCreateDto)
        {
            if (challengeCreateDto.UserId == challengeCreateDto.FriendId)
            {
                throw new BadRequestException("User cannot challenge themself.");
            }
            if (await _challengeRepository.IsChallengeRequestSent(challengeCreateDto.UserId, challengeCreateDto.FriendId, challengeCreateDto.Habit.Id))
            {
                throw new BadRequestException("Challenge request already sent.");
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
            bool isAccepted = challengeUpdateDto.Status.Equals("Accepted", StringComparison.OrdinalIgnoreCase);

            if (isAccepted && !challengeUpdateDto.Habit.ChallengedFriends.Contains(challengeUpdateDto.FriendId))
            {
                challengeUpdateDto.Habit.ChallengedFriends.Add(challengeUpdateDto.FriendId);
            }

            HabitModel? habitModel = await _habitRepository.UpdateHabitAsync(_mapper.Map<HabitModel>(challengeUpdateDto.Habit))
                ?? throw new BadRequestException("Failed to update habit for challenge.");

            ChallengeModel updatedChallenge = await _challengeRepository.UpdateChallengeAsync(challengeModel)
                ?? throw new BadRequestException("Failed to update challenge.");

            if (isAccepted)
            {
                await _habitLogGeneratorService.GenerateLogsForHabitAsync(habitModel);
            }

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
