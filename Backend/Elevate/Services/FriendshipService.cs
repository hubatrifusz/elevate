using Elevate.Data.Repository;
using Elevate.Models.User;
using Elevate.Models.Friendship;
using AutoMapper;

namespace Elevate.Services
{
    public class FriendshipService(FriendshipRepository friendshipRepository, IMapper mapper) : IFriendshipService
    {
        private readonly FriendshipRepository _friendshipRepository = friendshipRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ApplicationUser>> GetFriendsAsync(Guid userId)
        {
            return await _friendshipRepository.GetFriendsAsync(userId);
        }

        public async Task<Friendship> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto)
        {
            var friendship = _mapper.Map<Friendship>(friendshipCreateDto);
            return await _friendshipRepository.AddFriendshipAsync(friendship);
        }

        public async Task<Friendship> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            return await _friendshipRepository.DeleteFriendshipAsync(userId, friendId);
        }
    }
}
