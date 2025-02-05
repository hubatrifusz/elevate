namespace Elevate.Extensions
{
    public static class IQueryableExtension
    {
        public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, int pageNumber, int pageSize, int maxPageSize = 20)
        {
            pageSize = Math.Min(pageSize, maxPageSize);
            pageSize = Math.Max(pageSize, 1);

            return query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
        }
    }
}
