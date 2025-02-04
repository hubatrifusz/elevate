using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.Achievement
{
    public class AchievementDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required, MaxLength(20)]
        public required string Title { get; set; }
        [Required, MaxLength(100)]
        public required string Description { get; set; }
    }
}
