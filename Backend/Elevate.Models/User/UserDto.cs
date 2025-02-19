using Elevate.Common.Utilities;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.User
{
    public class UserDto
    {
        [Required]
        public required Guid Id { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTimeConverter.GetCetTime();
        [Required, EmailAddress, MaxLength(30)]
        public required string Email { get; set; }
        [Required, MaxLength(20)]
        public required string FirstName { get; set; }
        [Required, MaxLength(20)]
        public required string LastName { get; set; }
        //limit file size
        public byte[]? ProfilePicture { get; set; }
        [Required]
        public required int LongestStreak { get; set; } = 0;
    }
}
