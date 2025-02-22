using Asp.Versioning;
using Elevate.Data.Database;
using Elevate.Extensions;
using Elevate.Profiles;
using Elevate.Models;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Swashbuckle.AspNetCore.SwaggerGen;
using Elevate.Common.Utilities;

namespace Elevate
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.AddEnvironmentVariables();

            builder.Services.AddControllers(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(
                    new LowerCaseParameterTransformer())
                );
            });

            builder.Services.AddIdentity();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Add configuration
            builder.Services.AddSingleton(builder.Configuration);

            //Add ConnectionManager
            builder.Services.AddTransient<DbConnectionManager>();

            // Register Repositories and DbContext with MySQL
            builder.Services.AddRepositories();

            // Register Services
            builder.Services.AddServices();

            // Add AutoMapper with profiles
            builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

            //Add API versioning and explorer
            builder.Services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
            }).AddApiExplorer(opt =>
            {
                opt.GroupNameFormat = "'v'VVV";
                opt.SubstituteApiVersionInUrl = true;
            });

            //Configure Swagger
            builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCorsPolicies();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("DevelopmentPolicy");

            builder.Services.AddAuthorization();
            builder.Services.AddJwtAuthentication(builder.Configuration);

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ElevateDbContext>();

                var retryCount = 5;
                for (int i = 0; i < retryCount; i++)
                {
                    try
                    {
                        dbContext.Database.Migrate();
                        break;
                    }
                    catch (MySqlException)
                    {
                        Thread.Sleep(2000);
                    }
                }
            }

            app.Run();
        }
    }
}
