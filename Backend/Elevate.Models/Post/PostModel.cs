using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Post
{
    public class PostModel
    {
        public ApplicationUser? User { get; set; }
        public HabitModel? HabitModel { get; set; }
        public HabitLogModel? HabitLogModel { get; set; }
    }
}
