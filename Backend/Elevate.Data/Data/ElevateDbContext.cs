using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data
{
    public class ElevateDbContext(DbContextOptions<ElevateDbContext> options, DbConnectionManager connectionManager) : DbContext(options)
    {
        private readonly DbConnectionManager _connectionManager = connectionManager;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string? connectionString = _connectionManager.GetConnectionString();
                optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            }
        }

        DbSet<UserModel> Users { get; set; }
        DbSet<HabitModel> Habit { get; set; }
        DbSet<AchievementModel> Achievements { get; set; }
    }
}
