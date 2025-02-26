using System.Security.Claims;

namespace Elevate.Common.Utilities
{
    public static class UserPermissionUtility
    {
        public static bool IsCurrentUser(Guid actingUserId, ClaimsPrincipal ownerUser)
        {
            var currentUserId = ownerUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return currentUserId == actingUserId.ToString();
        }
    }
}
