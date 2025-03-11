using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Habit
{
    public class HabitDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required DateTime CreatedAt { get; set; }
        [Required, MaxLength(20)]
        public required string Title { get; set; }
        [MaxLength(100)]
        public string? Description { get; set; }
        [Required]
        public required string FrequencyType { get; set; }
        public sbyte? CustomFrequency { get; set; }
        [Required, MaxLength(6)]
        public required string Color { get; set; }
        [Required]
        public required bool IsPositive { get; set; }
        [Required]
        public required int Streak { get; set; }
        public DateTime? StreakStart { get; set; }
        [Required]  
        public required bool Deleted { get; set; }
    }
}
