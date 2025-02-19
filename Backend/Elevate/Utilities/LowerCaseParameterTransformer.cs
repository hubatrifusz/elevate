namespace Elevate.Utilities
{
    public class LowerCaseParameterTransformer : IOutboundParameterTransformer
    {
            public string? TransformOutbound(object? value)
            {
                return value?.ToString()?.ToLower();
            }
    }
}
