namespace Elevate.Models
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int LongestStreak { get; set; } = 0;

        public UserModel(string firstName, string lastName, string email, string passwordHash)
        {
            Id = Guid.NewGuid();
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PasswordHash = passwordHash;
        }

        public UserModel(Guid id, DateTime createdAt, string firstName, string lastName, string email, string passwordHash, int longestStrek)
        {
            Id = id;
            CreatedAt = createdAt;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PasswordHash = passwordHash;
            LongestStreak = longestStrek;
        }
    }
}
