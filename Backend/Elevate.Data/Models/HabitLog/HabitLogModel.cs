using Microsoft.VisualBasic;

namespace Elevate.Data.Models.HabitLog
{
    public class HabitLogModel
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required Guid HabitId { get; set; }
        public required DateTime DueDate { get; set; }
        public required bool Completed { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
        public string? Notes { get; set; }
        public required bool IsPublic { get; set; } = false;
    }
}
