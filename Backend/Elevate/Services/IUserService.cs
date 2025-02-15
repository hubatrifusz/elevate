using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IUserService
    {
        ApplicationUser? GetUserById(Guid userId);
        List<ApplicationUser>? GetUsersByEmail(string email, int pageNumber, int pageSize);
        ApplicationUser? AddUser(UserCreateDto user);
        ApplicationUser? UpdateUser(Guid id, UserUpdateDto user);
        ApplicationUser? DeleteUser(Guid userId);
    }
}
