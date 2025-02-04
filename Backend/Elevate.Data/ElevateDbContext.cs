using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;
using Elevate.Data.Models.AchievementProgress;

namespace Elevate.Data
{
    public class ElevateDbContext(DbContextOptions<ElevateDbContext> options, DbConnectionManager connectionManager) : DbContext(options)
    {
        public DbSet<UserModel> Users { get; set; }
        public DbSet<HabitModel> Habit { get; set; }
        public DbSet<AchievementModel> Achievements { get; set; }

        private readonly DbConnectionManager _connectionManager = connectionManager;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string? connectionString = _connectionManager.GetConnectionString();
                optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<HabitLogModel>().HasIndex(h => new { h.UserId, h.HabitId });
            modelBuilder.Entity<HabitLogModel>().HasIndex(h => h.DueDate);
            modelBuilder.Entity<AchievementProgressModel>().HasIndex(a => a.UserId);
        }
    }
}
