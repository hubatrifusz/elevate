using System.ComponentModel.DataAnnotations;

namespace Elevate.Models.Challenge
{
    public class ValidChallengeInviteStatusAttribute(bool isRequired = false) : ValidationAttribute
    {
        private readonly bool _isRequired = isRequired;

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                if (_isRequired)
                {
                    return new ValidationResult("Challenge invite status is required.");
                }
                return ValidationResult.Success;
            }

            var challengeInviteStatus = value as string;
            if (challengeInviteStatus == null)
            {
                return new ValidationResult("Invalid challenge invite status.");
            }

            if (!Enum.TryParse(typeof(ChallengeInviteStatus), challengeInviteStatus, true, out _))
            {
                return new ValidationResult($"Invalid challenge invite status. Valid values are: {string.Join(", ", Enum.GetNames(typeof(ChallengeInviteStatus)))}.");
            }

            return ValidationResult.Success;
        }
    }
}
