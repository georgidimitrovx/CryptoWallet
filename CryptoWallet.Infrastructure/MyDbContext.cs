using CryptoWallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CryptoWallet.Infrastructure
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Asset> Assets { get; set; }
    }
}
