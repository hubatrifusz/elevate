using Microsoft.AspNetCore.Identity;

namespace Elevate.Models.User
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public required DateTime CreatedAt { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public int? LongestStreak { get; set; } = 0;
    }
}
