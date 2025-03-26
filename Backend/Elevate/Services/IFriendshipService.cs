using Elevate.Models.Friendship;
using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IFriendshipService
    {
        Task<List<UserDto>> GetFriendsAsync(Guid userId);
        Task<List<UserDto>> GetFriendRequestsAsync(Guid userId);
        Task<bool> AreFriends(Guid userId, Guid friendId);
        Task<FriendshipDto> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto);
        Task<FriendshipDto> UpdateFriendshipAsync(FriendshipUpdateDto friendshipUpdateDto);
        Task<FriendshipDto> DeleteFriendshipAsync(Guid userId, Guid friendId);
    }
}
