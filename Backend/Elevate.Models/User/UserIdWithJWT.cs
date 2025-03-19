namespace Elevate.Models.User
{
    public class UserIdWithJWT
    {
        public required Guid UserId { get; set; }
        public required string Token { get; set; }
    }
}
