namespace Elevate.Common.Utilities
{
    public static class DateTimeConverter
    {
        public static DateTime GetCetTime()
        {
            return DateTime.UtcNow.AddHours(1);
        }

        public static DateTime UtcToCetTime(this DateTime dateTime)
        {
            return dateTime.AddHours(1);
        }

        public static DateTime CetToUtcTime(this DateTime dateTime)
        {
            return dateTime.AddHours(-1);
        }
    }
}
