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
            var response = new
            {
                message = exception.Message,
                statusCode = 500
            };

            switch (exception)
            {
                case ResourceNotFoundException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response = new { message = exception.Message, statusCode = 404 };
                    break;
                case BadRequestException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = new { message = exception.Message, statusCode = 400 };
                    break;
                case AuthorizationException:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    response = new { message = exception.Message, statusCode = 403 };
                    break;
                default:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response = new { message = "An unexpected error occurred", statusCode = 500 };
                    break;
            }

            var json = JsonSerializer.Serialize(response, _jsonSerializerOptions);
            await httpContext.Response.WriteAsync(json);
        }
    }
}
