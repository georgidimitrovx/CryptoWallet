using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using Microsoft.EntityFrameworkCore;

namespace CryptoWallet.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateAsync(User user)
        {
            var inserted = _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return inserted.Entity;
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
