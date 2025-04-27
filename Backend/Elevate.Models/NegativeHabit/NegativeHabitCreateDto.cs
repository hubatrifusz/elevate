using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.NegativeHabit
{
    public class NegativeHabitCreateDto
    {
        [Required]
        public required Guid UserId { get; set; }
        [Required, MaxLength(20)]
        public required string Title { get; set; }
        [MaxLength(100)]
        public string? Description { get; set; }
        [Required, StringLength(6)]
        public required string Color { get; set; }
    }
}
