using Elevate.Common.Utilities;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.User
{
    public class UserCreateDto
    {
        public DateTime? CreatedAt { get; set; } = DateTimeConverter.GetCetTime();

        [Required, EmailAddress, MaxLength(30)]
        public required string Email { get; set; }

        [Required, MinLength(12)]
        public required string Password { get; set; }

        [Required, Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public required string ConfirmPassword { get; set; }

        [Required, MaxLength(20)]
        public required string FirstName { get; set; }

        [Required, MaxLength(20)]
        public required string LastName { get; set; }

        //limit file size
        public byte[]? ProfilePicture { get; set; }
    }
}
