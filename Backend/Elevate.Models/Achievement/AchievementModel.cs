namespace Elevate.Models.Achievement
{
    public class AchievementModel()
    {
        public required Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
    }
}
