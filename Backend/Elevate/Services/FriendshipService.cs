using Elevate.Data.Repository;
using Elevate.Models.User;
using Elevate.Models.Friendship;
using Elevate.Common.Exceptions;
using AutoMapper;

namespace Elevate.Services
{
    public class FriendshipService(FriendshipRepository friendshipRepository, IMapper mapper) : IFriendshipService
    {
        private readonly FriendshipRepository _friendshipRepository = friendshipRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<UserDto>> GetFriendsAsync(Guid userId)
        {
            List<ApplicationUser> users = await _friendshipRepository.GetFriendsAsync(userId);

            return users.Count == 0
                ? throw new ResourceNotFoundException("User has no friends.")
                : _mapper.Map<List<UserDto>>(users);
        }

        public async Task<List<UserDto>> GetFriendRequestsAsync(Guid userId)
        {
            List<ApplicationUser> users = await _friendshipRepository.GetFriendRequestsAsync(userId);

            return users.Count == 0
                ? throw new ResourceNotFoundException("User has no friend requests.")
                : _mapper.Map<List<UserDto>>(users);
        }

        public async Task<List<FriendshipDto>> GetSentFriendRequestsAsync(Guid userId)
        {
            List<FriendshipModel> requests = await _friendshipRepository.GetSentFriendRequestsAsync(userId);

            return requests.Count == 0
                ? throw new ResourceNotFoundException("User sent no friend requests.")
                : _mapper.Map<List<FriendshipDto>>(requests);
        }

        public async Task<bool> AreFriends(Guid userId, Guid friendId)
        {
            return await _friendshipRepository.AreFriends(userId, friendId);
        }

        public async Task<FriendshipDto> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto)
        {
            if (friendshipCreateDto.UserId == friendshipCreateDto.FriendId)
            {
                throw new BadRequestException("User cannot be friends with themself.");
            }
            FriendshipModel friendship = _mapper.Map<FriendshipModel>(friendshipCreateDto);
            FriendshipModel savedFriendship = await _friendshipRepository.AddFriendshipAsync(friendship)
                ?? throw new BadRequestException("Failed to add friend.");

            return _mapper.Map<FriendshipDto>(savedFriendship);
        }

        public async Task<FriendshipDto> UpdateFriendshipAsync(FriendshipUpdateDto friendshipUpdateDto)
        {
            if (!await AreFriends(friendshipUpdateDto.UserId, friendshipUpdateDto.FriendId))
            {
                throw new NotFriendsException();
            }

            FriendshipModel friendshipModel = _mapper.Map<FriendshipModel>(friendshipUpdateDto);

            FriendshipModel updatedFriendship = await _friendshipRepository.UpdateFriendshipAsync(friendshipModel)
                ?? throw new BadRequestException("Failed to update friendship.");

            return _mapper.Map<FriendshipDto>(updatedFriendship);
        }

        public async Task<FriendshipDto> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            if (!await AreFriends(userId, friendId))
            {
                throw new NotFriendsException();
            }

            FriendshipModel friendship = await _friendshipRepository.DeleteFriendshipAsync(userId, friendId)
                ?? throw new ResourceNotFoundException("Failed to remove friend.");

            return _mapper.Map<FriendshipDto>(friendship);
        }
    }
}
