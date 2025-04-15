using Elevate.Models.Friendship;
using Elevate.Models.User;

namespace Elevate.Services.Friendship
{
    public interface IFriendshipService
    {
        Task<List<UserDto>> GetFriendsAsync(Guid userId);
        Task<List<UserDto>> GetFriendRequestsAsync(Guid userId);
        Task<List<FriendshipDto>> GetSentFriendRequestsAsync(Guid userId);
        Task<FriendshipDto> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto);
        Task<FriendshipDto> UpdateFriendshipAsync(FriendshipUpdateDto friendshipUpdateDto);
        Task<FriendshipDto> DeleteFriendshipAsync(Guid userId, Guid friendId);
    }
}
