using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public class FeedService(FeedRepository feedRepository, IMapper _mapper) : IFeedService
    {
        private readonly FeedRepository _feedRepository = feedRepository;
        private readonly IMapper _mapper = _mapper;
        public async Task<List<HabitLogDto>> GetFeedAsync(int pageNumber, int pageSize)
        {
            List<HabitLogModel> habitLogModels = await _feedRepository.GetFeedAsync(pageNumber, pageSize);
            return habitLogModels.Count == 0
                ? throw new ResourceNotFoundException("Can't update feed.")
                : _mapper.Map<List<HabitLogDto>>(habitLogModels);
        }
    }
}
