using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Friendship
{
    public class FriendshipUpdateDto
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid FriendId { get; set; }
        [Required]
        public FriendshipStatus Status { get; set; }
    }
}
