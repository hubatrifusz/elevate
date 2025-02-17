using Elevate.Models.User;
using Elevate.Utilities;

namespace Elevate.Services
{
    public interface IUserService
    {
        ApplicationUser? GetUserById(Guid userId);
        List<ApplicationUser>? GetUsersByEmail(string email, int pageNumber, int pageSize);
        Task<IdentityResultWithUser> AddUserAsync(UserCreateDto user);
        ApplicationUser? UpdateUser(Guid id, UserUpdateDto user);
        ApplicationUser? DeleteUser(Guid userId);
    }
}
