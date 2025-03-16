using System.Net;
using System.Text.Json;
using Elevate.Common.Exceptions;

namespace Elevate.Middleware
{
    public class GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<GlobalExceptionHandler> _logger = logger;
        private readonly JsonSerializerOptions _jsonSerializerOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception has occured.");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext httpContext, Exception exception)
        {
            httpContext.Response.ContentType = "application/json";
            var response = exception.Message;

            switch (exception)
            {
                case ResourceNotFoundException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response = exception.Message;
                    break;
                case BadRequestException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = exception.Message;
                    break;
                case AuthorizationException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response = exception.Message;
                    break;
                case WrongPasswordException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    response = exception.Message;
                    break;
                case InvalidPasswordException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = exception.Message;
                    break;
                case ConnectionStringException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.FailedDependency;
                    response = exception.Message;
                    break;
                case DuplicateUserException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    response = exception.Message;
                    break;
                case NotFriendsException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    response = exception.Message;
                    break;
                default:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response = "An unexpected error occurred";
                    break;
            }

            var json = JsonSerializer.Serialize(response, _jsonSerializerOptions);
            await httpContext.Response.WriteAsync(json);
        }
    }
}
