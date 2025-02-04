using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elevate.Data.Models.AchievementProgress
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
