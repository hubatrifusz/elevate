using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.HabitLog
{
    public class HabitLogCreateDto
    {
        [Required]
        public required Guid UserId { get; set; }

        [Required]
        public required Guid HabitId { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public required bool Completed { get; set; }

        public DateTime? CompletedAt { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }

        [Required]
        public required bool IsPublic { get; set; } = false;
    }
}
