using Elevate.Models.Friendship;
using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IFriendshipService
    {
        Task<List<ApplicationUser>> GetFriendsAsync(Guid userId);
        Task<Friendship> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto);
        Task<Friendship> DeleteFriendshipAsync(Guid userId, Guid friendId);
    }
}
