using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Friendship
{
    public class FriendshipCreateDto
    {
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid FriendId { get; set; }
    }
}
