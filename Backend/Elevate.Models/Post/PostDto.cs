using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Post
{
    public class PostDto
    {
        [Required]
        public required UserDto User { get; set; }
        [Required]
        public required HabitDto Habit { get; set; }
        [Required]
        public required HabitLogDto HabitLog { get; set; }
    }
}
