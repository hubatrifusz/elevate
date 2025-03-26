using Microsoft.AspNetCore.Identity;

namespace Elevate.Models.User
{
    public class IdentityResultWithUser
    {
        public IdentityResult? Result { get; set; }
        public required UserDto User { get; set; }
    }
}
