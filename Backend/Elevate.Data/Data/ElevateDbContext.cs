using Elevate.Data.Models.AchievementUnlocks;
using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data
{
    public class ElevateDbContext(DbContextOptions<ElevateDbContext> options, DbConnectionManager connectionManager) : DbContext(options)
    {
        DbSet<UserModel> Users { get; set; }
        DbSet<HabitModel> Habit { get; set; }
        DbSet<AchievementModel> Achievements { get; set; }

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
            modelBuilder.Entity<AchievementUnlockModel>().HasIndex(a => a.UserId);
        }
    }
}
