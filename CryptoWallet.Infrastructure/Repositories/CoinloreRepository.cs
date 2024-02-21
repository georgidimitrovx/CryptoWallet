using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using Microsoft.EntityFrameworkCore;

namespace CryptoWallet.Infrastructure.Repositories
{
    public class CoinloreRepository : ICoinloreRepository
    {
        private readonly AppDbContext _context;

        public CoinloreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Coinlore> AddAsync(Coinlore coinlore)
        {
            var inserted = await _context.Coinlore.AddAsync(coinlore);
            await _context.SaveChangesAsync();
            return inserted.Entity;
        }

        public async Task<Coinlore> GetByExternalIdAsync(int externalId)
        {
            return await _context.Coinlore.FirstOrDefaultAsync(x => x.ExternalId == externalId);
        }

        public async Task<Coinlore> UpdateAsync(Coinlore coinlore)
        {
            var inserted = _context.Coinlore.Update(coinlore);
            await _context.SaveChangesAsync();
            return inserted.Entity;
        }

        public async Task<Coinlore> GetByTickerAsync(string ticker)
        {
            return await _context.Coinlore.FirstOrDefaultAsync(x => x.Ticker == ticker);
        }

        public async Task<Coinlore> GetFirstAsync()
        {
            return await _context.Coinlore.FirstOrDefaultAsync();
        }
    }
}
