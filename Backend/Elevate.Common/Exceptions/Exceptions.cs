namespace Elevate.Common.Exceptions
{
    public class ResourceNotFoundException(string message = "The requested resource was not found.") 
        : Exception(message) {}

    public class BadRequestException(string message = "The request is invalid.") 
        : Exception(message) { }

    public class AuthorizationException(string message = "You are not authorized to perform this action.") 
        : Exception(message){ }
}
