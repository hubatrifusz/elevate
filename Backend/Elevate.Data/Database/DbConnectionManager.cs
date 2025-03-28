using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Npgsql;
using System.Data.Common;

namespace Elevate.Data.Database
{
    public class DbConnectionManager(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;

        public string? GetConnectionString()
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
            {
                return _configuration.GetConnectionString("ProductionConnection");
            }
            else
            {
                return _configuration.GetConnectionString("LocalConnection");
            }
        }

        public DbConnection GetOpenConnection()
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
            {
                var connection = new NpgsqlConnection(GetConnectionString());
                connection.Open();
                return connection;
            }
            else
            {
                var connection = new MySqlConnection(GetConnectionString());
                connection.Open();
                return connection;
            }
        }
       
        public static bool IsProduction() => Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production";
    }
}
