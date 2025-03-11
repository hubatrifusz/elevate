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

        public async Task<FriendshipModel> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto)
        {
            var friendship = _mapper.Map<FriendshipModel>(friendshipCreateDto);
            return await _friendshipRepository.AddFriendshipAsync(friendship);
        }

        public async Task<FriendshipModel> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            return await _friendshipRepository.DeleteFriendshipAsync(userId, friendId);
        }
    }
}
