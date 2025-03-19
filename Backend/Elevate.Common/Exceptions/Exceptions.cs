namespace Elevate.Common.Exceptions
{
    public class ResourceNotFoundException(string message = "The requested resource was not found.") 
        : Exception(message) { }

    public class BadRequestException(string message = "The request is invalid.") 
        : Exception(message) { }

    public class AuthorizationException(string message = "You are not authorized to perform this action.") 
        : Exception(message) { }

    public class InvalidPasswordException(string message = "Password must contain at least 12 characters, an uppercase letter, a number and a symbol.")
        : Exception(message) { }

    public class WrongPasswordException(string message = "Invalid password.")
        : Exception(message) { }

    public class ConnectionStringException(string message = "Connection string is invalid.")
        : Exception(message) { }

    public class DuplicateUserException(string message = "User already exists.")
        : Exception(message) { }

    public class NotFriendsException(string message = "Not friends with user.")
        : Exception(message)
    { }
}
