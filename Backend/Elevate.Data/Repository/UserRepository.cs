using Elevate.Models.User;
using Elevate.Extensions;

namespace Elevate.Data.Repository
{
    public class UserRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public UserModel? GetUserById(Guid userId)
        {
            return _context.Set<UserModel>().SingleOrDefault(u => u.Id == userId);
        }

        public List<UserModel>? GetUsersByEmail(string email, int pageNumber, int pageSize)
        {
            return _context.Set<UserModel>()
                .Where(u => u.Email.Contains(email))
                .ApplyPagination(pageNumber, pageSize)
                .ToList();
        }

        public UserModel? AddUser(UserModel user)
        {
            UserModel savedUser = _context.Set<UserModel>().Add(user).Entity;
            _context.SaveChanges();
            return savedUser;
        }

        public UserModel? UpdateUser(Guid id, UserModel user)
        {
            if (id != user.Id)
            {
                throw new Exception("User ID does not match");
            }
            if (!_context.Set<UserModel>().Any(u => u.Id == id))
            {
                throw new Exception("No such user");
            }
            _context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();
            return user;
        }

        public UserModel? DeleteUser(Guid userId)
        {
            UserModel? user = _context.Set<UserModel>().SingleOrDefault(u => u.Id == userId);
            if (user == null)
            {
                throw new Exception("No such user");
            }
            _context.Set<UserModel>().Remove(user);
            _context.SaveChanges();
            return user;
        }
    }
}
