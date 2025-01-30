using Microsoft.Extensions.Configuration;
using MySqlConnector;

namespace Elevate.Data
{
    public class DbConnectionManager(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;

        public string? GetConnectionString()
        {
            if (IsRunningOnGoogleCloud())
            {
                var cloudSqlBuilder = new MySqlConnectionStringBuilder
                {
                    ConnectionString = _configuration.GetConnectionString("CloudSqlConnection")
                };
                return cloudSqlBuilder.ConnectionString;
            }
            else
            {
                return _configuration.GetConnectionString("LocalConnection");
            }
        }

        public MySqlConnection GetOpenConnection()
        {
            var connection = new MySqlConnection(GetConnectionString());
            connection.Open();
            return connection;
        }

        private static bool IsRunningOnGoogleCloud()
        {
            return Environment.GetEnvironmentVariable("K_SERVICE") != null ||
               Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS") != null;
        }
    }
}
