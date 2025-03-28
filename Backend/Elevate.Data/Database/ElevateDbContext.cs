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
using Elevate.Models.Challenge;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Elevate.Data.Database
{
    public class ElevateDbContext(
        DbContextOptions<ElevateDbContext> options,
        DbConnectionManager connectionManager) : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
    {
        private readonly DbConnectionManager _connectionManager = connectionManager;

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<HabitModel> Habits { get; set; }
        public DbSet<ChallengeModel> Challenges { get; set; }
        public DbSet<AchievementModel> Achievements { get; set; }
        public DbSet<HabitLogModel> HabitLogs { get; set; }
        public DbSet<AchievementProgressModel> AchievementProgresses { get; set; }
        public DbSet<FriendshipModel> Friendships { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = _connectionManager.GetConnectionString()
                    ?? throw new ConnectionStringException("Connection string could not be retrieved.");

                if (DbConnectionManager.IsProduction())
                {
                    optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
                    {
                        npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory");
                        npgsqlOptions.EnableRetryOnFailure(5);
                    });

                    optionsBuilder.ConfigureWarnings(warnings =>
                        warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
                }
                else
                {
                    var serverVersion = ServerVersion.AutoDetect(connectionString);

                    optionsBuilder.UseMySql(connectionString, serverVersion, mySqlOptions =>
                    {
                        mySqlOptions.MigrationsHistoryTable("__EFMigrationsHistory");
                        mySqlOptions.EnablePrimitiveCollectionsSupport();
                    });
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            if (DbConnectionManager.IsProduction())
            {
                modelBuilder.UseIdentityAlwaysColumns(); 

                modelBuilder.Entity<ApplicationUser>().ToTable("aspnetusers");
                modelBuilder.Entity<IdentityRole<Guid>>().ToTable("aspnetroles");
                modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("aspnetuserroles");
                modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("aspnetuserclaims");
                modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("aspnetuserlogins");
                modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("aspnetroleclaims");
                modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("aspnetusertokens");

                modelBuilder.Entity<HabitModel>().ToTable("habits");
                modelBuilder.Entity<HabitLogModel>().ToTable("habitlogs");
                modelBuilder.Entity<ChallengeModel>().ToTable("challenges");
                modelBuilder.Entity<AchievementModel>().ToTable("achievements");
                modelBuilder.Entity<AchievementProgressModel>().ToTable("achievementprogresses");
                modelBuilder.Entity<FriendshipModel>().ToTable("friendships");
            }

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

            modelBuilder.Entity<ChallengeModel>()
                .HasIndex(c => new { c.UserId, c.FriendId })
                .IsUnique();

            modelBuilder.Entity<ChallengeModel>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChallengeModel>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(c => c.FriendId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
