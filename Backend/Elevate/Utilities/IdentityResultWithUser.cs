using Elevate.Models.User;
using Microsoft.AspNetCore.Identity;

namespace Elevate.Utilities
{
    public class IdentityResultWithUser
    {
        public IdentityResult? Result { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
