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

        public async Task<ApplicationUser?> GetUserByIdAsync(Guid userId)
        {
            return await _userRepository.GetUserByIdAsync(userId);
        }

        public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<List<ApplicationUser>?> GetUsersByEmailAsync(string email, int pageNumber, int pageSize)
        {
            return await _userRepository.GetUsersByEmailAsync(email, pageNumber, pageSize);
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

        public async Task<ApplicationUser?> UpdateUserAsync(Guid id, UserUpdateDto userUpdateDto)
        {
            var ApplicationUser = await _userRepository.GetUserByIdAsync(id)
                ?? throw new Exception("User not found");

            _mapper.Map(userUpdateDto, ApplicationUser);

            return await _userRepository.UpdateUserAsync(id, ApplicationUser);
        }

        public ApplicationUser? DeleteUser(Guid userId)
        {
            return _userRepository.DeleteUser(userId);
        }
    }
}
