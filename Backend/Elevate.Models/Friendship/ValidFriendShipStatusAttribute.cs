using Elevate.Models.Habit;
using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Friendship
{
    public class ValidFriendShipStatusAttribute(bool isRequired = false) : ValidationAttribute
    {
        private readonly bool _isRequired = isRequired;

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                if (_isRequired)
                {
                    return new ValidationResult("FriendshipStatus is required.");
                }
                return ValidationResult.Success;
            }

            var friendshipStatus = value as string;
            if (friendshipStatus == null)
            {
                return new ValidationResult("Invalid FriendshipStatus.");
            }

            if (!Enum.TryParse(typeof(FriendshipStatus), friendshipStatus, true, out _))
            {
                return new ValidationResult($"Invalid FriendshipStatus. Valid values are: {string.Join(", ", Enum.GetNames(typeof(FriendshipStatus)))}.");
            }

            return ValidationResult.Success;
        }
    }
}
