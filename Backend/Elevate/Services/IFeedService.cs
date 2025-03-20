using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public interface IFeedService
    {
        Task<List<HabitLogDto>> GetFeedAsync(int pageNumber, int pageSize);
    }
}
