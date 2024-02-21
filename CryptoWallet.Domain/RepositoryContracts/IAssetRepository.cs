using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Domain.RepositoryContracts
{
    public interface IAssetRepository
    {
        Task<Asset> AddAsync(Asset asset);
        Task<bool> DeleteAllByUserIdAsync(int userId);
        Task<List<Asset>> GetAllByUserIdAsync(int userId);
    }
}
