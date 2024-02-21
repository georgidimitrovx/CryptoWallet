using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Domain.RepositoryContracts
{
    public interface ICoinloreRepository
    {
        Task<Coinlore> GetByExternalIdAsync(int externalId);
        Task<Coinlore> AddAsync(Coinlore coinlore);
        Task<Coinlore> UpdateAsync(Coinlore coinlore);
        Task<Coinlore> GetByTickerAsync(string ticker);
        Task<Coinlore> GetFirstAsync();
    }
}
