namespace Elevate.Models.Habit
{
    public class HabitModel
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required FrequencyEnum FrequencyType { get; set; }
        public ushort? CustomFrequency { get; set; }
        public required string Color { get; set; }
        public required bool IsPositive { get; set; }
        public int Streak { get; set; } = 0;
        public DateTime StreakStart { get; set; } = DateTime.UtcNow;
        public required bool Deleted { get; set; }
    }
}
