using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elevate.Data.Models.AchievementProgress
{
    public class AchievementProgressModel
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required Guid AchievementId { get; set; }
        public int Progress { get; set; } = 0;
        public int Target { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
    }
}
