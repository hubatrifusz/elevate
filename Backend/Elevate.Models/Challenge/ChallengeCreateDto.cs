using Elevate.Models.Habit;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Challenge
{
    public class ChallengeCreateDto
    {
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid FriendId { get; set; }
        [Required]
        public required HabitDto Habit { get; set; }
    }
}
