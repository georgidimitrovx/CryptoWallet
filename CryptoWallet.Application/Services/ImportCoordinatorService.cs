
using CryptoWallet.Application.DTOs;
using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Application.Services
{
    public class ImportCoordinatorService : IImportCoordinatorService
    {
        private readonly IAssetService _assetService;
        private readonly IFileImportService _fileImportService;
        private readonly ITransactionManager _transactionManager;

        public ImportCoordinatorService(IAssetService assetService,
            IFileImportService fileImportService,
            ITransactionManager transactionManager)
        {
            _assetService = assetService;
            _fileImportService = fileImportService;
            _transactionManager = transactionManager;
        }

        public async Task<bool> ProcessImport(User user, FileImportDto fileImportDto)
        {
            try
            {
                _transactionManager.BeginTransaction();

                // Remove all assets for user
                if (!await _assetService.DeleteAllByUserIdAsync(user.Id))
                    throw new Exception("Failed to delete user assets.");

                // Convert file to bytes
                byte[] file;
                using (var memoryStream = new MemoryStream())
                {
                    await fileImportDto.File.CopyToAsync(memoryStream);
                    file = memoryStream.ToArray();
                }

                // Convert file to assets records
                var newAssets = _assetService.ConvertFileToAssets(file);
                if (newAssets == null)
                    throw new Exception("Failed to convert file to assets.");

                // Add new assets for user
                foreach (var asset in newAssets)
                {
                    asset.UserId = user.Id;

                    var result = await _assetService.AddAsync(asset);
                    if (result == null)
                        throw new Exception("Failed to create asset.");
                }

                // Add new file import record
                FileImport newFile = new FileImport();
                newFile.UserId = user.Id;
                newFile.FileName = fileImportDto.File.FileName;
                newFile.UploadTime = DateTime.Now;
                newFile.Size = fileImportDto.File.Length;

                using (var memoryStream = new MemoryStream())
                {
                    await fileImportDto.File.CopyToAsync(memoryStream);
                    newFile.File = memoryStream.ToArray();
                }

                var resultFile = await _fileImportService.AddAsync(newFile);
                if (resultFile == null)
                    throw new Exception("Failed to create file import record.");

                // Commit trans
                await _transactionManager.CommitAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                _transactionManager.Rollback();
                return false;
            }

            return true;
        }
    }
}
