namespace Elevate.Models
{
    public class HabitModel
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Title { get; set; }
        public string? Description { get; set; }
        public FrequencyEnum FrequencyType { get; set; }
        public int? CustomFrequency { get; set; } = null;
        public string Color { get; set; }
        public bool IsPositive { get; set; }
        public int Streak { get; set; } = 0;
        public DateTime StreakStart { get; set; } = DateTime.UtcNow;

        public HabitModel(string title, string description, FrequencyEnum frequencyType, int customFrequency, string color, bool isPositive)
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
            Title = title;
            Description = description;
            FrequencyType = frequencyType;
            CustomFrequency = customFrequency;
            Color = color;
            IsPositive = isPositive;
        }

        public HabitModel(Guid id, DateTime createdAt, string title, string description, FrequencyEnum frequencyType, int customFrequency, string color, bool isPositive, int streak, DateTime streakStart)
        {
            Id = id;
            CreatedAt = createdAt;
            Title = title;
            Description = description;
            FrequencyType = frequencyType;
            CustomFrequency = customFrequency;
            Color = color;
            IsPositive = isPositive;
            Streak = streak;
            StreakStart = streakStart;
        }
    }
}
