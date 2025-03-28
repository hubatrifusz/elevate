using Elevate.Models.HabitLog;
using Elevate.Models.Post;

namespace Elevate.Services.Feed
{
    public interface IFeedService
    {
        Task<List<PostDto>> GetFeedAsync(int pageNumber, int pageSize);
    }
}
