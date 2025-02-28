using Elevate.Models.User;
using Elevate.Extensions;
using Elevate.Data.Database;
using Microsoft.EntityFrameworkCore;

namespace Elevate.Data.Repository
{
    public class UserRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public async Task<ApplicationUser?> GetUserByIdAsync(Guid userId)
        {
            return await _context.Set<ApplicationUser>().SingleOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<List<ApplicationUser>?> GetUsersByEmailAsync(string email, int pageNumber, int pageSize)
        {
            return await _context.Set<ApplicationUser>()
                .Where(u => u.Email != null && u.Email.Contains(email))
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
        }

        public async Task<ApplicationUser?> UpdateUserAsync(Guid id, ApplicationUser user)
        {
            if (id != user.Id)
            {
                throw new Exception("User ID does not match");
            }
            var updatedUser = await _context.Set<ApplicationUser>().AnyAsync(u => u.Id == id);
            if (!updatedUser)
            {
                throw new Exception("No such user");
            }
            _context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
