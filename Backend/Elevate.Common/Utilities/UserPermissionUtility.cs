using System.Security.Claims;

namespace Elevate.Common.Utilities
{
    public static class UserPermissionUtility
    {
        public static bool IsCurrentUser(Guid resourceUserId, ClaimsPrincipal user)
        {
            if (user == null || !user.Identity!.IsAuthenticated)
            {
                return false;
            }

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return false;
            }

            return userId == resourceUserId;
        }
    }
}
