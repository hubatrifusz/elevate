using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Challenge
{
    public class ChallengeUpdateDto
    {
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid FriendId { get; set; }
        [Required]
        [ValidChallengeInviteStatus(isRequired: true)]
        public required string Status { get; set; }
    }
}
