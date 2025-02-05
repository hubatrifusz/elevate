using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elevate.Models.HabitLog
{
    public class HabitLogUpdateDto
    {
        public DateTime? DueDate { get; set; }

        public bool? Completed { get; set; }

        public DateTime? CompletedAt { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }

        public bool? IsPublic { get; set; }
    }
}
