using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.User;

namespace Elevate.Services
{
    public class UserService(UserRepository userRepository, IMapper mapper) : IUserService
    {
        private readonly UserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

        public ApplicationUser? GetUserById(Guid userId)
        {
            return _userRepository.GetUserById(userId);
        }

        public List<ApplicationUser>? GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            return _userRepository.GetUsersByEmail(email, pageNumber, pageSize);
        }

        public ApplicationUser? AddUser(UserCreateDto user)
        {
            var ApplicationUser = _mapper.Map<ApplicationUser>(user);
            return _userRepository.AddUser(ApplicationUser);
        }

        public ApplicationUser? UpdateUser(Guid id, UserUpdateDto userUpdateDto)
        {
            var ApplicationUser = _userRepository.GetUserById(id)
                ?? throw new Exception("User not found");

            _mapper.Map(userUpdateDto, ApplicationUser);

            return _userRepository.UpdateUser(id, ApplicationUser);
        }

        public ApplicationUser? DeleteUser(Guid userId)
        {
            return _userRepository.DeleteUser(userId);
        }
    }
}
