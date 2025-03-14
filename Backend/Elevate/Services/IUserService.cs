using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserByIdAsync(Guid userId);
        Task<UserDto> GetUserByEmailAsync(string email);
        Task<List<UserDto>> GetUsersByEmailAsync(string email, int pageNumber, int pageSize);
        Task<IdentityResultWithUser> AddUserAsync(UserCreateDto user);
        Task<UserDto> UpdateUserAsync(Guid id, UserUpdateDto user);
        Task<UserIdWithJWT> SignInAsync(UserDto user, string password, bool lockoutOnFailure);
    }
}
