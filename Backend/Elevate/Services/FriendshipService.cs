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

        public async Task<bool> AreFriends(Guid userId, Guid friendId)
        {
            return await _friendshipRepository.AreFriends(userId, friendId);
        }

        public async Task<FriendshipDto> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto)
        {
            FriendshipModel friendship = _mapper.Map<FriendshipModel>(friendshipCreateDto);
            FriendshipModel savedFriendship = await _friendshipRepository.AddFriendshipAsync(friendship)
                ?? throw new BadRequestException("Failed to add friend.");

            return _mapper.Map<FriendshipDto>(savedFriendship);
        }

        public async Task<FriendshipDto> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            if(!await AreFriends(userId, friendId))
            {
                throw new NotFriendsException();
            }

            FriendshipModel friendship = await _friendshipRepository.DeleteFriendshipAsync(userId, friendId)
                ?? throw new ResourceNotFoundException("Failed to remove friend.");

            return _mapper.Map<FriendshipDto>(friendship);
        }
    }
}
