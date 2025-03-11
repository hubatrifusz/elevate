using Elevate.Models.Friendship;
using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IFriendshipService
    {
        Task<List<ApplicationUser>> GetFriendsAsync(Guid userId);
        Task<FriendshipModel> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto);
        Task<FriendshipModel> DeleteFriendshipAsync(Guid userId, Guid friendId);
    }
}
