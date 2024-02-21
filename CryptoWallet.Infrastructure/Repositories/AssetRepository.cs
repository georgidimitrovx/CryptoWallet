using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using Microsoft.EntityFrameworkCore;

namespace CryptoWallet.Infrastructure.Repositories
{
    public class AssetRepository : IAssetRepository
    {
        private readonly AppDbContext _context;

        public AssetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Asset> AddAsync(Asset asset)
        {
            var inserted = await _context.Assets.AddAsync(asset);
            await _context.SaveChangesAsync();
            return inserted.Entity;
        }

        public async Task<bool> DeleteAllByUserIdAsync(int userId)
        {
            var sqlCommand = $"DELETE FROM Assets WHERE UserId = {userId}";
            await _context.Database.ExecuteSqlRawAsync(sqlCommand);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Asset>> GetAllAsync()
        {
            throw new NotImplementedException();
        }
    }
}
