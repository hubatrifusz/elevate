﻿using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Friendship
{
    public class FriendshipDto
    {
        [Required]
        public required Guid Id { get; set; }
        [Required]
        public required Guid UserId { get; set; }
        [Required]
        public required Guid FriendId { get; set; }
        [Required]
        public required string Status { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
