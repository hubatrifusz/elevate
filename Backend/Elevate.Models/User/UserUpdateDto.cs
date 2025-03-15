using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.User
{
    public class UserUpdateDto
    {
        [Required(ErrorMessage = "First Name is required")]
        [MaxLength(20)]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [MaxLength(20)]
        public required string LastName { get; set; }

        [MaxLength(5242880)]
        [Base64String(ErrorMessage = "The provided profile picture is not a valid BASE64 string.")]
        public string? ProfilePictureBase64 { get; set; }
    }
}
