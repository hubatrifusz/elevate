using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.User
{
    public class UserUpdateDto
    {
        [MaxLength(20)]
        public string? FirstName { get; set; }

        [MaxLength(20)]
        public string? LastName { get; set; }

        [MaxLength(5242880)]
        [Base64String(ErrorMessage = "The provided profile picture is not a valid BASE64 string.")]
        public string? ProfilePictureBase64 { get; set; }
    }
}
