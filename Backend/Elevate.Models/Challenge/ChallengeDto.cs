using Elevate.Models.Habit;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Challenge
{
    public class ChallengeDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid FriendId { get; set; }
        [Required]
        public required HabitDto Habit { get; set; }
        [Required]
        public required string Status { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
