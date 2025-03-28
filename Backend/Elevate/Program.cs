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
using Elevate.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace Elevate
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.WebHost.UseUrls("http://0.0.0.0:8000");

            builder.Configuration.AddEnvironmentVariables();

            builder.Services.AddControllers(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(
                    new LowerCaseParameterTransformer())
                );
            });

            builder.Services.AddIdentity();
            builder.Services.AddEndpointsApiExplorer();

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
            builder.Services.AddSwagger();
            builder.Services.AddSwaggerGen(c =>
                c.EnableAnnotations()
            );

            builder.Services.AddCorsPolicies();

            builder.Services.AddAuthorization();
            builder.Services.AddJwtAuthentication(builder.Configuration);

            var app = builder.Build();

            app.UseMiddleware<GlobalExceptionHandler>();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment() || app.Environment.IsProduction())  
                // remove production 
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("DevelopmentPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ElevateDbContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

                try
                {
                    if (DbConnectionManager.IsProduction())
                    {
                        logger.LogInformation("Running in Production environment with PostgreSQL");

                        try
                        {
                            // Check if the schema (tables) exists
                            bool hasSchema = dbContext.Database.GetService<IRelationalDatabaseCreator>()
                                .HasTables();

                            if (!hasSchema)
                            {
                                logger.LogInformation("PostgreSQL database exists but has no tables. Creating schema...");
                                // This creates all tables according to your model
                                dbContext.Database.EnsureCreated();
                                logger.LogInformation("PostgreSQL schema created successfully");
                            }
                            else
                            {
                                logger.LogInformation("PostgreSQL database schema already exists");
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex, "Error initializing PostgreSQL database");
                            throw; // Critical error - rethrow to prevent app from starting with broken DB
                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Database initialization failed");
                }
            }

            app.Run();
        }
    }
}
