using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.HabitLog
{
    public class HabitLogDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid HabitId { get; set; }
        [Required]
        public required DateTime DueDate { get; set; }
        [Required]
        public required bool Completed { get; set; }
        public DateTime? CompletedDate { get; set; }
        [MaxLength(255)]
        public string? Notes { get; set; }
        [Required]
        public required bool IsPublic { get; set; }
    }
}
