using Elevate.Models;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.Habit
{
    public class HabitDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required DateTime CreatedAt { get; set; }
        [Required, MaxLength(20)]
        public required string Title { get; set; }
        [MaxLength(100)]
        public string? Description { get; set; }
        [Required]
        public required FrequencyEnum Frequency { get; set; }
        public short? CustomFrequency { get; set; }
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
