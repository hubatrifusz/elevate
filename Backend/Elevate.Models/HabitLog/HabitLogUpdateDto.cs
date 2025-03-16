using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.HabitLog
{
    public class HabitLogUpdateDto
    {
        public bool? Completed { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }

        public bool? IsPublic { get; set; }
    }
}
