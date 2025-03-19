using Elevate.Models.Habit;
using System.ComponentModel.DataAnnotations;

public class ValidFrequencyTypeAttribute : ValidationAttribute
{
    private readonly bool _isRequired;

    public ValidFrequencyTypeAttribute(bool isRequired = false)
    {
        _isRequired = isRequired;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            if (_isRequired)
            {
                return new ValidationResult("FrequencyType is required.");
            }
            return ValidationResult.Success;
        }

        var frequencyType = value as string;
        if (frequencyType == null)
        {
            return new ValidationResult("Invalid FrequencyType.");
        }

        if (!Enum.TryParse(typeof(FrequencyEnum), frequencyType, true, out _))
        {
            return new ValidationResult($"Invalid FrequencyType. Valid values are: {string.Join(", ", Enum.GetNames(typeof(FrequencyEnum)))}.");
        }

        return ValidationResult.Success;
    }
}
