using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.User
{
    public class UserDto
    {
        [Required]
        public required Guid Id { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
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
