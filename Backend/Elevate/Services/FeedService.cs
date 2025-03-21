using AutoMapper;
using Elevate.Common.Exceptions;
using Elevate.Data.Repository;
using Elevate.Models.Post;

namespace Elevate.Services
{
    public class FeedService(FeedRepository feedRepository, IMapper _mapper) : IFeedService
    {
        private readonly FeedRepository _feedRepository = feedRepository;
        private readonly IMapper _mapper = _mapper;
        public async Task<List<PostDto>> GetFeedAsync(int pageNumber, int pageSize)
        {
            List<PostModel> postModels = await _feedRepository.GetFeedAsync(pageNumber, pageSize);
            return postModels.Count == 0
                ? throw new ResourceNotFoundException("Can't update feed.")
                : _mapper.Map<List<PostDto>>(postModels);
        }
    }
}
