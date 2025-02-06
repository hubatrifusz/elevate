using System.Linq;

namespace Elevate.Extensions
{
    public static class IQueryableExtension
    {
        public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, int? pageNumber, int? pageSize)
        {
            pageNumber = pageNumber.HasValue && pageNumber > 0 ? pageNumber : 1;
            pageSize = pageSize.HasValue && pageSize > 0 && pageSize <= 20 ? pageSize : 20;

            return query
                .Skip((pageNumber.Value - 1) * pageSize.Value)
                .Take(pageSize.Value);
        }
    }
}
