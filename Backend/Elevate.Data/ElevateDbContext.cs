using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;
using Elevate.Models.AchievementProgress;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Elevate.Models.Friendship;
using System;

namespace Elevate.Data
{
    public class ElevateDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        private readonly DbConnectionManager _connectionManager;

        public ElevateDbContext(DbContextOptions<ElevateDbContext> options, DbConnectionManager connectionManager)
            : base(options)
        {
            _connectionManager = connectionManager;
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<HabitModel> Habits { get; set; }
        public DbSet<AchievementModel> Achievements { get; set; }
        public DbSet<HabitLogModel> HabitLogs { get; set; }
        public DbSet<AchievementProgressModel> AchievementProgresses { get; set; }
        public DbSet<Friendship> Friendships { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string? connectionString = _connectionManager.GetConnectionString();
                if (connectionString != null)
                {
                    optionsBuilder.UseMySQL(connectionString);
                }
                else
                {
                    throw new InvalidOperationException("Connection string is null");
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<HabitLogModel>().HasIndex(h => new { h.UserId, h.HabitId });
            modelBuilder.Entity<HabitLogModel>().HasIndex(h => h.DueDate);
            modelBuilder.Entity<AchievementProgressModel>().HasIndex(a => a.UserId);

            modelBuilder.Entity<Friendship>()
                .HasIndex(f => new { f.UserId, f.FriendId })
                .IsUnique();

            modelBuilder.Entity<Friendship>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(f => f.FriendId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
