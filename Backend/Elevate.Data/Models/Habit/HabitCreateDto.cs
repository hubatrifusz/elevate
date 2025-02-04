using Elevate.Models;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.Habit
{
    public class HabitCreateDto
    {
        [Required, MaxLength(20)]
        public required string Title { get; set; }

        [MaxLength(100)]
        public string? Description { get; set; }

        [Required]
        public required FrequencyEnum Frequency { get; set; }

        public short? CustomFrequency { get; set; }

        [Required, StringLength(6)]
        public required string Color { get; set; }

        [Required]
        public required bool IsPositive { get; set; }
    }
}
