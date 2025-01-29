namespace Elevate.Models.User
{
    public class UserDto
    {
            public required Guid Id { get; set; }
            public required DateTime CreatedAt { get; set; }
            public required string Email { get; set; }
            public required string FirstName { get; set; }
            public required string LastName { get; set; }
            public required int TotalStreak { get; set; }
            public required DateTime? StreakStart { get; set; }
            public required int LongestStreak { get; set; }
    }
}
