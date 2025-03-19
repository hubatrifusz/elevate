using Elevate.Common.Exceptions;
using System.Security.Claims;

namespace Elevate.Common.Utilities
{
    public static class UserPermissionUtility
    {
        public static void IsCurrentUser(Guid resourceUserId, ClaimsPrincipal user)
        {
            if (user == null || !user.Identity!.IsAuthenticated)
            {
                throw new AuthorizationException();
            }

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                throw new AuthorizationException();
            }

            if(userId != resourceUserId)
            {
                throw new AuthorizationException();
            }
        }
    }
}
