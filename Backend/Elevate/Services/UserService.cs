using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.User;

namespace Elevate.Services
{
    public class UserService(UserRepository userRepository, IMapper mapper) : IUserService
    {
        private readonly UserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

        public UserModel? GetUserById(Guid userId)
        {
            return _userRepository.GetUserById(userId);
        }

        public List<UserModel>? GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            return _userRepository.GetUsersByEmail(email, pageNumber, pageSize);
        }

        public UserModel? AddUser(UserCreateDto user)
        {
            var userModel = _mapper.Map<UserModel>(user);
            return _userRepository.AddUser(userModel);
        }

        public UserModel? UpdateUser(Guid id, UserUpdateDto userUpdateDto)
        {
            var userModel = _userRepository.GetUserById(id)
                ?? throw new Exception("User not found");

            _mapper.Map(userUpdateDto, userModel);

            return _userRepository.UpdateUser(id, userModel);
        }

        public UserModel? DeleteUser(Guid userId)
        {
            return _userRepository.DeleteUser(userId);
        }
    }
}
