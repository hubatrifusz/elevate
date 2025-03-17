using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Friendship
{
    class FriendshipUpdateDto
    {
        [Required]
        public FriendshipStatus Status { get; set; }
    }
}
