using Elevate.Data;
using Elevate.Data.Repository;

namespace Elevate.Extensions
{
    public static class IServiceCollectionExtension
    {
        public static void AddRepositories(this IServiceCollection service)
        {
            service.AddScoped<UserRepository>();
            service.AddDbContext<ElevateDbContext>();
        }
    }
}
