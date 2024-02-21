using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Domain.RepositoryContracts
{
    public interface IAssetRepository
    {
        Task<IEnumerable<Asset>> GetAllAsync();
        Task<Asset> AddAsync(Asset asset);
        Task<bool> DeleteAllByUserIdAsync(int userId);
    }
}
