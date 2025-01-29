namespace Elevate.Models.User
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public int LongestStreak { get; set; } = 0;
    }
}
