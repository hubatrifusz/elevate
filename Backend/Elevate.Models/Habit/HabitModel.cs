using Elevate.Common.Utilities;

namespace Elevate.Models.Habit
{
    public class HabitModel
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required List<Guid> ChallengedFriends { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTimeConverter.UtcToCetTime(DateTime.UtcNow), DateTimeKind.Utc);
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required FrequencyEnum FrequencyType { get; set; }
        public sbyte? CustomFrequency { get; set; }
        public required string Color { get; set; }
        public required string StreakProgression { get; set; } = $"0/0";
        public int Streak { get; set; } = 0;
        public DateTime StreakStart { get; set; } = DateTime.SpecifyKind(DateTimeConverter.UtcToCetTime(DateTime.UtcNow), DateTimeKind.Utc);
        public required bool Deleted { get; set; }
    }
}
