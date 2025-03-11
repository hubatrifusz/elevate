using Google.Cloud.SecretManager.V1;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Elevate.Data.Database
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
                cloudSqlBuilder.UserID = GetSecret("DB_USERNAME");
                cloudSqlBuilder.Password = GetSecret("DB_PASSWORD");

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

        public bool IsAppInDevelopment()
        {
            if (_configuration.GetValue<string>("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                return true;
            }
            return false;
        }

        private static bool IsRunningOnGoogleCloud()
        {
            return Environment.GetEnvironmentVariable("GCE_METADATA_HOST") != null;
        }

        private string GetSecret(string secretName)
        {
            SecretManagerServiceClient client = SecretManagerServiceClient.Create();
            SecretVersionName secretVersionName = new SecretVersionName("brave-set-449017-d0", secretName, "latest");
            AccessSecretVersionResponse result = client.AccessSecretVersion(secretVersionName);
            return result.Payload.Data.ToStringUtf8();
        }
    }
}
