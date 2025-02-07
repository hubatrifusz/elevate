using Elevate.Models.User;

namespace Elevate.Services
{
    public interface IUserService
    {
        UserModel? GetUserById(Guid userId);
        List<UserModel>? GetUsersByEmail(string email, int pageNumber, int pageSize);
        UserModel? AddUser(UserCreateDto user);
        UserModel? UpdateUser(Guid id, UserUpdateDto user);
        UserModel? DeleteUser(Guid userId);
    }
}
