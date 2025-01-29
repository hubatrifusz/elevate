using Microsoft.VisualBasic;

namespace Elevate.Models.HabitLog
{
    public class HabitLogModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid HabitId { get; set; }
        public required DateTime DueDate { get; set; }
        public bool Completed { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
        public string? Notes { get; set; }
    }
}
