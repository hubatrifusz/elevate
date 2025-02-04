using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.AchievementProgress
{
    public class AchievementProgressDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid AchievementId { get; set; }
        [Required]
        public required int Progress { get; set; }
        [Required]
        public required int Target { get; set; }
        [Required]
        public required bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
