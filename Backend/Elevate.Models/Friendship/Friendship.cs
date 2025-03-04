namespace Elevate.Models.Friendship
{
    public class Friendship
    {
        public required Guid Id { get; set; }

        public required Guid UserId { get; set; }
        public required Guid FriendId { get; set; }

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
