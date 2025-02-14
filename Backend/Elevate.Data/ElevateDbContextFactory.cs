using Elevate.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

public class ElevateDbContextFactory : IDesignTimeDbContextFactory<ElevateDbContext>
{
    public ElevateDbContext CreateDbContext(string[] args)
    {
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "Elevate");
        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<ElevateDbContext>();
        var connectionManager = new DbConnectionManager(configuration);
        var connectionString = connectionManager.GetConnectionString();
        optionsBuilder.UseMySQL(connectionString);

        return new ElevateDbContext(optionsBuilder.Options, connectionManager);
    }
}
