using Elevate.Models.User;
using Elevate.Extensions;

namespace Elevate.Data.Repository
{
    public class UserRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public ApplicationUser? GetUserById(Guid userId)
        {
            return _context.Set<ApplicationUser>().SingleOrDefault(u => u.Id == userId);
        }

        public List<ApplicationUser>? GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            return _context.Set<ApplicationUser>()
                .Where(u => u.Email != null && u.Email.Contains(email))
                .ApplyPagination(pageNumber, pageSize)
                .ToList();
        }

        public ApplicationUser? AddUser(ApplicationUser user)
        {
            ApplicationUser savedUser = _context.Set<ApplicationUser>().Add(user).Entity;
            _context.SaveChanges();
            return savedUser;
        }

        public ApplicationUser? UpdateUser(Guid id, ApplicationUser user)
        {
            if (id != user.Id)
            {
                throw new Exception("User ID does not match");
            }
            if (!_context.Set<ApplicationUser>().Any(u => u.Id == id))
            {
                throw new Exception("No such user");
            }
            _context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();
            return user;
        }

        public ApplicationUser? DeleteUser(Guid userId)
        {
            ApplicationUser? user = _context.Set<ApplicationUser>().SingleOrDefault(u => u.Id == userId);
            if (user == null)
            {
                throw new Exception("No such user");
            }
            _context.Set<ApplicationUser>().Remove(user);
            _context.SaveChanges();
            return user;
        }
    }
}
