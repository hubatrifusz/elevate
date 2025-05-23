﻿using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Habit
{
    public class HabitCreateDto
    {
        [Required, MaxLength(20)]
        public required string Title { get; set; }

        [Required]
        public required Guid UserID { get; set; }

        [MaxLength(100)]
        public string? Description { get; set; }

        [Required]
        [ValidFrequencyType(isRequired: true)]
        public required string FrequencyType { get; set; }

        public sbyte? CustomFrequency { get; set; }

        [Required, StringLength(6)]
        public required string Color { get; set; }
    }
}
