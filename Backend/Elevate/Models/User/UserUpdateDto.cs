using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.User
{
    public class UserUpdateDto
    {
        [MaxLength(20)]
        public string? FirstName { get; set; }

        [MaxLength(20)]
        public string? LastName { get; set; }
    }
}
