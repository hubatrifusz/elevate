using Elevate.Models.HabitLog;
using Elevate.Models.Post;
using Elevate.Services.Feed;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedController(IFeedService feedService) : ControllerBase
    {
        private readonly IFeedService _feedService = feedService;

        [HttpGet]
        public async Task<ActionResult<List<PostDto>>> GetFeedAsync(int pageNumber, int pageSize)
        {
            return Ok(await _feedService.GetFeedAsync(pageNumber, pageSize));
        }
    }
}
