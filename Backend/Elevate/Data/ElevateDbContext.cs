using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.User;
using Microsoft.EntityFrameworkCore;
using System;

namespace Elevate.Data
{
    public class ElevateDbContext(DbContextOptions<ElevateDbContext> options) : DbContext(options)
    {
        DbSet<UserModel> Users { get; set; }
        DbSet<HabitModel> Habit { get; set; }
        DbSet<AchievementModel> Achievements { get; set; }
    }
}
