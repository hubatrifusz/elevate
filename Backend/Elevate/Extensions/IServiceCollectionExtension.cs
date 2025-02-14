using Elevate.Data.Database;
using Elevate.Data.Repository;
using Elevate.Services;

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
    }
}
