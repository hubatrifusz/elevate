using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Habit
{
    public class HabitUpdateDto
    {

        [MaxLength(20)]
        public string? Title { get; set; }

        [MaxLength(100)]
        public string? Description { get; set; }

        public string? FrequencyType { get; set; }

        public sbyte? CustomFrequency { get; set; }

        [StringLength(6)]
        public string? Color { get; set; }

        public bool? IsPublic { get; set; }
    }
}
