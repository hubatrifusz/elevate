using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.HabitLog
{
    public class HabitLogCreateDto
    {
        [Required]
        public Guid HabitId { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public bool Completed { get; set; }

        public DateTime CompletedAt { get; set; }

        [MaxLength(100)]
        public string? Notes { get; set; }
    }
}
