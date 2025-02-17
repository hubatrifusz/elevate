using Elevate.Data.Database;
using Elevate.Data.Repository;
using Elevate.Models.User;
using Elevate.Services;
using Microsoft.AspNetCore.Identity;

namespace Elevate.Extensions
{
    public static class IServiceCollectionExtension
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<UserRepository>();
            services.AddScoped<HabitRepository>();
            services.AddScoped<HabitLogRepository>();
            services.AddScoped<FriendshipRepository>();

            services.AddDbContext<ElevateDbContext>();
        }

        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IHabitService, HabitService>();
            services.AddScoped<IHabitLogService, HabitLogService>();
            services.AddScoped<IFriendshipService, FriendshipService>();
        }

        public static void AddIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 12;
                options.Password.RequiredUniqueChars = 1;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                options.User.RequireUniqueEmail = true;

                //options.SignIn.RequireConfirmedAccount = true;
            })
            .AddEntityFrameworkStores<ElevateDbContext>()
            .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                options.LoginPath = "/Account/Login";
                options.AccessDeniedPath = "/Account/AccessDenied";
                options.SlidingExpiration = true;
            });

            // Add email sending service (example using built-in but consider a library)
        }
    }
}
