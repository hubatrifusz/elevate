using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Common.Utilities;
using Elevate.Data.Repository;
using Elevate.Models.User;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Elevate.Services
{
    public class UserService(UserRepository userRepository, IMapper mapper,
        IConfiguration configuration) : IUserService
    {
        private readonly UserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;
        private readonly JwtUtility _jwtUtility = new(configuration);

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            ApplicationUser user = (await _userRepository.GetUsersByEmailAsync(email, 1, 1)).First()
                ?? throw new ResourceNotFoundException("User was not found.");

            return _mapper.Map<UserDto>(user);
        }

        public async Task<List<UserDto>> GetUsersByEmailAsync(string email, int pageNumber, int pageSize)
        {
            List<ApplicationUser> users = await _userRepository.GetUsersByEmailAsync(email, pageNumber, pageSize);
            
            return users.Count == 0
                ? throw new ResourceNotFoundException("No users found.")
                : _mapper.Map<List<UserDto>>(users);
        }

        public async Task<UserDto> GetUserByIdAsync(Guid userId)
        {
            ApplicationUser user = await _userRepository.GetUserByIdAsync(userId)
                ?? throw new ResourceNotFoundException("User was not found.");

            return _mapper.Map<UserDto>(user);
        }

        public async Task<IdentityResultWithUser> AddUserAsync(UserCreateDto userCreateDto)
        {
            ApplicationUser user = _mapper.Map<ApplicationUser>(userCreateDto);
            user.UserName = user.Email;
            IdentityResult result = await _userRepository.CreateUserAsync(user, userCreateDto.Password)
                ?? throw new BadRequestException("Failed to create user");

            return new IdentityResultWithUser { Result = result, User = _mapper.Map<UserDto>(user) };
        }

        public async Task<UserDto> UpdateUserAsync(Guid id, UserUpdateDto userUpdateDto)
        {
            ApplicationUser user = _mapper.Map<ApplicationUser>(userUpdateDto);
                            user.Id = id;

            ApplicationUser updatedUser = await _userRepository.UpdateUserAsync(user)
                ?? throw new BadRequestException("Failed to update user.");

            return _mapper.Map<UserDto>(updatedUser);
        }

        public async Task<UserIdWithJWT> SignInAsync(UserDto user, string password, bool lockoutOnFailure)
        {
            ApplicationUser applicationUser = await _userRepository.GetUserByIdAsync(user.Id)
                ?? throw new ResourceNotFoundException("User was not found.");

            SignInResult signInResult = await _userRepository.CheckPasswordSignInAsync(applicationUser, password, lockoutOnFailure);

            if (!signInResult.Succeeded)
            {
                throw new InvalidPasswordException();
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            string token = _jwtUtility.GenerateJwtRsa(claims);
            return new UserIdWithJWT() { UserId = user.Id, Token = token };
        }
    }
}