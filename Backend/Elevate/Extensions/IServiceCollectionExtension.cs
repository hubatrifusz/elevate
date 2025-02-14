using Elevate.Data;
using Elevate.Data.Repository;
using Elevate.Services;

namespace Elevate.Extensions
{
    public static class IServiceCollectionExtension
    {
        public static void AddRepositories(this IServiceCollection service)
        {
            service.AddScoped<UserRepository>();
            service.AddScoped<HabitRepository>();
            service.AddScoped<HabitLogRepository>();
            service.AddScoped<FriendshipRepository>();
            service.AddDbContext<ElevateDbContext>();
        }

        public static void AddServices(this IServiceCollection service)
        {
            service.AddScoped<IUserService, UserService>();
            service.AddScoped<IHabitService, HabitService>();
            service.AddScoped<IHabitLogService, HabitLogService>();
            service.AddScoped<IFriendshipService, FriendshipService>();
        }
    }
}
