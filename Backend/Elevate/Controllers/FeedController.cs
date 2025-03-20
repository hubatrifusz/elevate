using Elevate.Models.HabitLog;
using Elevate.Services;
using Microsoft.AspNetCore.Mvc;

namespace Elevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedController(IFeedService feedService) : ControllerBase
    {
        private readonly IFeedService _feedService = feedService;

        [HttpGet]
        public async Task<ActionResult<List<HabitLogDto>>> GetFeedAsync(int pageNumber, int pageSize)
        {
            return Ok(await _feedService.GetFeedAsync(pageNumber, pageSize));
        }
    }
}
