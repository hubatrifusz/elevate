using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.User
{
    public class UserCreateDto
    {
        [Required, EmailAddress, MaxLength(30)]
        public required string Email { get; set; }

        [Required, MinLength(8)]
        public required string Password { get; set; }

        [Required, MaxLength(20)]
        public required string FirstName { get; set; }

        [Required, MaxLength(20)]
        public required string LastName { get; set; }

        //limit file size
        public byte[]? ProfilePicture { get; set; }
    }
}
