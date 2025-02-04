using System.ComponentModel.DataAnnotations;

namespace Elevate.Data.Models.User
{
    public class UserUpdateDto
    {
        [Required(ErrorMessage = "First Name is required")]
        [MaxLength(20)]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [MaxLength(20)]
        public required string LastName { get; set; }

        //limit file size
        public byte[]? ProfilePicture { get; set; }
    }
}
