using Elevate.Models.User;
using Elevate.Extensions;
using Elevate.Data.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Elevate.Data.Repository
{
    public class UserRepository
    (
        ElevateDbContext context,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager
    )
    {
        readonly ElevateDbContext _context = context;
        readonly UserManager<ApplicationUser> _userManager = userManager;
        readonly SignInManager<ApplicationUser> _signInManager = signInManager;

        public async Task<ApplicationUser?> GetUserByIdAsync(Guid userId)
        {
            return await _context.ApplicationUsers.SingleOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<List<ApplicationUser>> GetUsersByEmailAsync(string email, int pageNumber, int pageSize)
        {
            return await _context.Set<ApplicationUser>()
                .Where(u => u.Email != null && u.Email.Contains(email))
                .ApplyPagination(pageNumber, pageSize)
                .ToListAsync();
        }

        public async Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password)
        {
            return await _userManager.CreateAsync(user, password);
        }

        public async Task<ApplicationUser?> UpdateUserAsync(ApplicationUser user)
        {
            var existingUser = await GetUserByIdAsync(user.Id);

            if (existingUser != null)
            {
                var properties = typeof(ApplicationUser).GetProperties();
                foreach (var property in properties)
                {
                    var newValue = property.GetValue(user);
                    if (newValue != null)
                    {
                        property.SetValue(existingUser, newValue);
                    }
                }

                _context.Entry(existingUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return existingUser;
            }

            return null;
        }

        public async Task<SignInResult> CheckPasswordSignInAsync(ApplicationUser user, string password, bool lockoutOnFailure)
        {
            return await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure);
        }
    }
}
