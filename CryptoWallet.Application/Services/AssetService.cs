using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using System.Text;

namespace CryptoWallet.Application.Services
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _assetRepository;

        public AssetService(IAssetRepository assetRepository)
        {
            _assetRepository = assetRepository;
        }

        public async Task<Asset> AddAsync(Asset asset)
        {
            return await _assetRepository.AddAsync(asset);
        }

        public async Task<bool> DeleteAllByUserIdAsync(int userId)
        {
            return await _assetRepository.DeleteAllByUserIdAsync(userId);
        }

        public List<Asset>? ConvertFileToAssets(byte[] bytes)
        {
            var assets = new List<Asset>();
            var fileContent = Encoding.UTF8.GetString(bytes);
            var lines = fileContent.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);

            foreach (var line in lines)
            {
                var parts = line.Split('|'); // Split the line into parts
                if (parts.Length == 3) // Ensure there are at least two parts
                {
                    try
                    {
                        var asset = new Asset
                        {
                            Amount = Convert.ToDouble(parts[0]),
                            Ticker = parts[1],
                            Price = Convert.ToDouble(parts[2].Trim()),
                            PurchasedOn = DateTime.UtcNow,
                        };
                        assets.Add(asset);
                    }
                    catch (FormatException ex)
                    {
                        Console.WriteLine($"Error parsing line '{line}': {ex.Message}");
                        // Optionally handle the error, e.g., by continuing to the next line
                        return null;
                    }
                }
            }

            return assets;
        }
    }
}
