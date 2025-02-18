using Elevate.Models.User;
using Elevate.Utilities;

namespace Elevate.Services
{
    public interface IUserService
    {
        Task<ApplicationUser?> GetUserByIdAsync(Guid userId);
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
        Task<List<ApplicationUser>?> GetUsersByEmailAsync(string email, int pageNumber, int pageSize);
        Task<IdentityResultWithUser> AddUserAsync(UserCreateDto user);
        Task<ApplicationUser?> UpdateUserAsync(Guid id, UserUpdateDto user);
        ApplicationUser? DeleteUser(Guid userId);
    }
}
