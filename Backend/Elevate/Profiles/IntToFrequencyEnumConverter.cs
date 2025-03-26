using AutoMapper;
using Elevate.Models.Habit;

namespace Elevate.Profiles
{
    public class IntToFrequencyEnumConverter : ITypeConverter<int, FrequencyEnum>
    {
        public FrequencyEnum Convert(int source, FrequencyEnum destination, ResolutionContext context)
        {
            if (Enum.IsDefined(typeof(FrequencyEnum), source))
            {
                return (FrequencyEnum)source;
            }
            else
            {
                throw new ArgumentOutOfRangeException(nameof(source), $"Invalid FrequencyEnum value: {source}");
            }
        }
    }
}