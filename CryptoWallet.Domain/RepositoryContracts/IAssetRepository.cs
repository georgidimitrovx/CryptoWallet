using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Domain.RepositoryContracts
{
    public interface IAssetRepository
    {
        Task<Asset> GetByIdAsync(Guid id);
        Task<IEnumerable<Asset>> GetAllAsync();
        Task AddAsync(Asset asset);
        Task UpdateAsync(Asset asset);
        Task DeleteAsync(Asset asset);
    }
}
