using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;
using Elevate.Models.AchievementProgress;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Elevate.Models.Friendship;
using Elevate.Common.Exceptions;

namespace Elevate.Data.Database
{
    public class ElevateDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        private readonly DbConnectionManager _connectionManager;

        public ElevateDbContext(
            DbContextOptions<ElevateDbContext> options,
            DbConnectionManager connectionManager)
            : base(options)
        {
            _connectionManager = connectionManager;
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<HabitModel> Habits { get; set; }
        public DbSet<AchievementModel> Achievements { get; set; }
        public DbSet<HabitLogModel> HabitLogs { get; set; }
        public DbSet<AchievementProgressModel> AchievementProgresses { get; set; }
        public DbSet<FriendshipModel> Friendships { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string? connectionString = _connectionManager.GetConnectionString();

            if (connectionString != null)
            {
                var serverVersion = ServerVersion.AutoDetect(connectionString);

                optionsBuilder.UseMySql(connectionString, serverVersion, mySqlOptions =>
                        {
                            mySqlOptions.MigrationsHistoryTable("__EFMigrationsHistory");
                            mySqlOptions.EnablePrimitiveCollectionsSupport();
                        });
            }
            else
            {
                throw new ConnectionStringException("Failed to retrieve connection string");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>(b =>
            {
                b.HasKey(u => u.Id);
                b.HasIndex(u => u.Email).IsUnique();
            });
            modelBuilder.Entity<ApplicationUser>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<HabitLogModel>().HasIndex(h => new { h.UserId, h.HabitId });
            modelBuilder.Entity<HabitLogModel>().HasIndex(h => h.DueDate);

            modelBuilder.Entity<AchievementProgressModel>().HasIndex(a => a.UserId);

            modelBuilder.Entity<FriendshipModel>()
                .HasIndex(f => new { f.UserId, f.FriendId })
                .IsUnique();

            modelBuilder.Entity<FriendshipModel>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FriendshipModel>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(f => f.FriendId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
