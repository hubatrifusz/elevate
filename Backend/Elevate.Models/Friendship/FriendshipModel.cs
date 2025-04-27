using Elevate.Common.Utilities;

namespace Elevate.Models.Friendship
{
    public class FriendshipModel
    {
        public required Guid Id { get; set; }

        public required Guid UserId { get; set; }
        public required Guid FriendId { get; set; }

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTimeConverter.UtcToCetTime(DateTime.UtcNow), DateTimeKind.Utc);
        public DateTime? UpdatedAt { get; set; } = DateTime.SpecifyKind(DateTimeConverter.UtcToCetTime(DateTime.UtcNow), DateTimeKind.Utc);
    }
}
