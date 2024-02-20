using CryptoWallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CryptoWallet.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<FileImport> FileImports { get; set; }
    }
}
