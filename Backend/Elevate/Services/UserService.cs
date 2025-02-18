using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.User;
using Elevate.Utilities;
using Microsoft.AspNetCore.Identity;

namespace Elevate.Services
{
    public class UserService(UserRepository userRepository, IMapper mapper, UserManager<ApplicationUser> userManager) : IUserService
    {
        private readonly UserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        public ApplicationUser? GetUserById(Guid userId)
        {
            return _userRepository.GetUserById(userId);
        }

        public List<ApplicationUser>? GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            return _userRepository.GetUsersByEmail(email, pageNumber, pageSize);
        }

        public async Task<IdentityResultWithUser> AddUserAsync(UserCreateDto userCreateDto)
        {
            var user = _mapper.Map<ApplicationUser>(userCreateDto);
            user.UserName = user.Email;
            var result = await _userManager.CreateAsync(user, userCreateDto.Password);

            if(result.Succeeded)
            {
                return new IdentityResultWithUser { Result = result, User = user };
            }
            return new IdentityResultWithUser { Result = result, User = null };
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
