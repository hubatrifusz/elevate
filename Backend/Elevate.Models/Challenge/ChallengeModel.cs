using Elevate.Common.Utilities;
using Elevate.Models.Habit;

namespace Elevate.Models.Challenge
{
    public class ChallengeModel
    {
        public required Guid Id { get; set; }

        public required Guid UserId { get; set; }
        public required Guid FriendId { get; set; }

        public required HabitModel Habit { get; set; }

        public ChallengeInviteStatus Status { get; set; } = ChallengeInviteStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTimeConverter.UtcToCetTime(DateTime.UtcNow), DateTimeKind.Utc);
        public DateTime? UpdatedAt { get; set; } = DateTime.SpecifyKind(DateTimeConverter.UtcToCetTime(DateTime.UtcNow), DateTimeKind.Utc);
    }
}
