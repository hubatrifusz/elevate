using Elevate.Models;
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
