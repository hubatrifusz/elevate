using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.NegativeHabit
{
    public class NegativeHabitDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required DateTime UpdatedAt { get; set; }
        [Required, MaxLength(20)]
        public required string Title { get; set; }
        [MaxLength(100)]
        public string? Description { get; set; }
        [Required, StringLength(6)]
        public required string Color { get; set; }
    }
}
