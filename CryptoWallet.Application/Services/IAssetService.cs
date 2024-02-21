using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Application.Services
{
    public interface IAssetService
    {
        Task<bool> DeleteAllByUserIdAsync(int userId);
        List<Asset>? ConvertFileToAssets(byte[] bytes);
        Task<Asset> AddAsync(Asset asset);
    }
}
