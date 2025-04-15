namespace Elevate.Common.Utilities
{
    public static class DateTimeConverter
    {
        private static readonly TimeZoneInfo CetZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Budapest");

        public static DateTime GetCetTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, CetZone);
        }

        public static DateTime UtcToCetTime(this DateTime dateTime)
        {
            if (dateTime.Kind != DateTimeKind.Utc)
                dateTime = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
                
            return TimeZoneInfo.ConvertTimeFromUtc(dateTime, CetZone);
        }

        public static DateTime CetToUtcTime(this DateTime dateTime)
        {
            if (dateTime.Kind != DateTimeKind.Unspecified)
                dateTime = DateTime.SpecifyKind(dateTime, DateTimeKind.Unspecified);
                
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, CetZone);
        }
    }
}