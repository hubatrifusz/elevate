using Elevate.Models.User;

namespace Elevate.Data.Repository
{
    public class UserRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public UserModel? GetUserById(Guid userId)
        {
            return _context.Set<UserModel>().SingleOrDefault(u => u.Id == userId);
        }

        public UserModel? GetUserByEmail(string email)
        {
            return _context.Set<UserModel>().SingleOrDefault(u => u.Email == email);
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
