using AutoMapper;
using Elevate.Data.Repository;
using Elevate.Models.User;
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

        public async Task<IdentityResult> AddUserAsync(ApplicationUser user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);

            if(result.Succeeded)
            {
                var addedUser = _userRepository.AddUser(user);

                if (addedUser == null)
                {
                    return IdentityResult.Failed(new IdentityError { Code = "RepositoryError", Description = "Failed to save user in repository." })
                }
            }
            return result;
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
