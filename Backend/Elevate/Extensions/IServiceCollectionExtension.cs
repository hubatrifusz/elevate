using Elevate.Common.Extensions;
using Elevate.Data.Database;
using Elevate.Data.Repository;
using Elevate.Models.User;
using Elevate.Services.Challenge;
using Elevate.Services.Feed;
using Elevate.Services.Friendship;
using Elevate.Services.Habit;
using Elevate.Services.HabitLog;
using Elevate.Services.Streak;
using Elevate.Services.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography;

namespace Elevate.Extensions
{
    public static class IServiceCollectionExtension
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<UserRepository>();
            services.AddScoped<HabitRepository>();
            services.AddScoped<ChallengeRepository>();
            services.AddScoped<HabitLogRepository>();
            services.AddScoped<FriendshipRepository>();
            services.AddScoped<FeedRepository>();

            services.AddScoped<HabitLogGeneratorRepository>();

            services.AddDbContext<ElevateDbContext>();
        }

        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IHabitService, HabitService>();
            services.AddScoped<IChallengeService, ChallengeService>();
            services.AddScoped<IHabitLogService, HabitLogService>();
            services.AddScoped<IFriendshipService, FriendshipService>();
            services.AddScoped<IFeedService, FeedService>();

            services.AddScoped<IHabitLogGeneratorService, HabitLogGeneratorService>();
            services.AddScoped<IStreakService, StreakService>();
            services.AddScoped<StreakService>();

            services.AddHostedService<HabitLogGenerationBackgroundService>();
            services.AddHostedService<StreakBackgroundService>();
        }

        public static void AddIdentity(this IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
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

                options.User.AllowedUserNameCharacters = "";

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

        public static void AddCorsPolicies(this IServiceCollection services) 
        {
            services.AddCors(options =>
            {
                options.AddPolicy("DevelopmentPolicy", builder =>
                {

                    builder.WithOrigins(["http://localhost:8080", "http://localhost:81", "http://localhost:4200", "http://localhost:8100"])
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });
        }

        public static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var publicKeyPem = configuration["Jwt:PublicKey"]
                ?? throw new InvalidOperationException($"Public key not configured.");

            var rsa = RSA.Create();
            rsa.ImportRSAPublicKeyPem(publicKeyPem);

            var rsaSecurityKey = new RsaSecurityKey(rsa);

            var audienceList = configuration["Jwt:Audience"]?.Split(',', StringSplitOptions.RemoveEmptyEntries) 
                ?? throw new InvalidOperationException("Audiences not configured.");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;   //change to true in production
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = rsaSecurityKey,
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudiences = audienceList,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(5)
                };
            });
            services.AddAuthorization();
        }

        public static void AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
        }
    }
}
