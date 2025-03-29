using AutoMapper;
using Elevate.Models.Friendship;

namespace Elevate.Profiles
{
    public class IntToFriendshipStatusEnumConverter : ITypeConverter<int, FriendshipStatus>
    {
        public FriendshipStatus Convert(int source, FriendshipStatus destination, ResolutionContext context)
        {
            if (Enum.IsDefined(typeof(FriendshipStatus), source))
            {
                return (FriendshipStatus)source;
            }
            else
            {
                throw new ArgumentOutOfRangeException(nameof(source), $"Invalid FriendshipStatus value: {source}");
            }
        }
    }
}
