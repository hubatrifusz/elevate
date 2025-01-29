namespace Elevate.Models.Habit
{
    public class HabitDto
    {
        public required Guid Id { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required FrequencyEnum Frequency { get; set; }
        public required short? CustomFrequency { get; set; }
        public required string Color { get; set; }
        public required bool IsPositive { get; set; }
        public required int Streak { get; set; }
        public required DateTime? StreakStart { get; set; }
        public required bool IsPublic { get; set; }
        public required bool Deleted { get; set; }
    }
}
