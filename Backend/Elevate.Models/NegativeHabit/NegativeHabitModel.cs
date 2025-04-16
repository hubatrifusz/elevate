namespace Elevate.Models.NegativeHabit
{
    public class NegativeHabitModel
    {
        public required Guid Id { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Color { get; set; }
        public required bool Deleted { get; set; }
    }
}
