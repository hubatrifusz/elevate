using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Friendship
{
    public class FriendshipUpdateDto
    {
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid FriendId { get; set; }
        [Required]
        [ValidFriendShipStatus(isRequired: true)]
        public required string Status { get; set; }
    }
}
