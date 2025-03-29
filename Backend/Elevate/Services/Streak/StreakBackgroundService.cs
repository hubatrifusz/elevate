namespace Elevate.Services.Streak
{
    public class StreakBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<StreakBackgroundService> _logger;

        public StreakBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<StreakBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Checking for broken streaks");
                    using var scope = _serviceProvider.CreateScope();
                    var streakService = scope.ServiceProvider.GetRequiredService<IStreakService>();

                    await streakService.CheckAndResetBrokenStreaks();

                    var now = DateTime.Now;
                    var nextMidnight = now.Date.AddDays(1);
                    var delay = nextMidnight - now;

                    await Task.Delay(delay, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to check streaks");
                    await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
                }
            }
        }
    }
}