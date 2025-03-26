using Elevate.Models.HabitLog;
using Elevate.Models.Post;

namespace Elevate.Services
{
    public interface IFeedService
    {
        Task<List<PostDto>> GetFeedAsync(int pageNumber, int pageSize);
    }
}
