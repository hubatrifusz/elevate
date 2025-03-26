using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Post
{
    public class PostModel
    {
        public ApplicationUser? User { get; set; }
        public HabitModel? Habit { get; set; }
        public HabitLogModel? HabitLog { get; set; }
    }
}
