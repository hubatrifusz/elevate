namespace Elevate.Models.Friendship
{
    public class Friendship
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
    }
}
