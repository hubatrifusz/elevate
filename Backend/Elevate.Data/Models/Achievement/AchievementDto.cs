namespace Elevate.Models.Achievement
{
    public class AchievementDto
    {
        public required Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required bool IsUnlocked { get; set; }
        public required DateTime? UnlockedAt { get; set; }
    }
}
