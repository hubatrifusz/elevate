using System;
using Xunit;
using Moq;
using Elevate.Services.User;
using Elevate.Models.User;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Elevate.Common.Exceptions;

namespace Elevate.Tests
{
    public class UnitTests
    {
        [Fact]
        public async Task GetUserByIdAsync_ExistingId_ReturnsUserDto()
        {
            var mockUserService = new Mock<IUserService>();
            var expectedUser = new UserDto
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                LongestStreak = 0
            };
            mockUserService.Setup(service => service.GetUserByIdAsync(expectedUser.Id))
                .ReturnsAsync(expectedUser);

            var result = await mockUserService.Object.GetUserByIdAsync(expectedUser.Id);

            Assert.NotNull(result);
            Assert.Equal(expectedUser.Id, result.Id);
            Assert.Equal(expectedUser.Email, result.Email);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ExistingEmail_ReturnsUserDto()
        {
            var mockUserService = new Mock<IUserService>();
            var expectedUser = new UserDto
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                LongestStreak = 0
            };
            mockUserService.Setup(service => service.GetUserByEmailAsync(expectedUser.Email))
                .ReturnsAsync(expectedUser);

            var result = await mockUserService.Object.GetUserByEmailAsync(expectedUser.Email);

            Assert.NotNull(result);
            Assert.Equal(expectedUser.Id, result.Id);
            Assert.Equal(expectedUser.Email, result.Email);
        }

        [Fact]
        public async Task AddUserAsync_ValidUser_ReturnsCreatedUser()
        {
            var mockUserService = new Mock<IUserService>();
            var userCreateDto = new UserCreateDto 
            { 
                Email = "newuser@example.com", 
                Password = "Password123!", 
                ConfirmPassword = "Password123!",
                FirstName = "Test",
                LastName = "User"
            };
            var expectedUser = new UserDto
            {
                Id = Guid.NewGuid(),
                Email = userCreateDto.Email,
                FirstName = "New",
                LastName = "User",
                LongestStreak = 0
            };
            var identityResult = IdentityResult.Success;
            var identityResultWithUser = new IdentityResultWithUser { Result = identityResult, User = expectedUser };

            mockUserService.Setup(service => service.AddUserAsync(userCreateDto))
                .ReturnsAsync(identityResultWithUser);

            var result = await mockUserService.Object.AddUserAsync(userCreateDto);

            Assert.NotNull(result);
            Assert.Equal(expectedUser.Id, result.User.Id);
            Assert.Equal(expectedUser.Email, result.User.Email);
            Assert.True(result.Result.Succeeded);
        }
    }
}
