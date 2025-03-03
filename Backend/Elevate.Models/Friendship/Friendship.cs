namespace Elevate.Models.Friendship
{
    public class Friendship
    {
        public required Guid Id { get; set; }

        public required string UserId { get; set; }
        public required string FriendId { get; set; }

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
