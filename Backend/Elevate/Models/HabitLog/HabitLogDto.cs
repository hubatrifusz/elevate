namespace Elevate.Models.HabitLog
{
    public class HabitLogDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid HabitId { get; set; }
        public DateTime DueDate { get; set; }
        public bool Completed { get; set; }
        public DateTime CompletedDate { get; set; }
        public string? Notes { get; set; }
    }
}
