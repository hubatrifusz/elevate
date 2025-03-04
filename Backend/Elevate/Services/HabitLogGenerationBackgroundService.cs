
namespace Elevate.Services
{
    public class HabitLogGenerationBackgroundService(IServiceProvider serviceProvider, ILogger<HabitLogGenerationBackgroundService> logger) : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        private readonly ILogger<HabitLogGenerationBackgroundService> _logger = logger;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Generating habit logs for all habits");
                    using var scope = _serviceProvider.CreateScope();
                    var habitLogGeneratorService = scope.ServiceProvider.GetRequiredService<IHabitLogGeneratorService>();

                    var totalLogsGenerated = habitLogGeneratorService.GenerateLogsForAllHabitsAsync().Result;

                    _logger.LogInformation($"Generated {totalLogsGenerated} habit logs");

                    var now = DateTime.Now;
                    var next3Am = now.Date.AddDays(now.Hour >= 3 ? 1 : 0).AddHours(3);
                    var delay = next3Am - now;

                    _logger.LogInformation("Next habit log generation scheduled at {NextRun}",
                        next3Am.ToString("yyyy-MM-dd HH:mm:ss"));

                    await Task.Delay(delay, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to generate habit logs");
                    await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
                }
            }
        }
    }
}
