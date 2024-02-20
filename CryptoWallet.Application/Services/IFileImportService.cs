using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Application.Services
{
    public interface IFileImportService
    {
        Task<FileImport> GetByUserIdAndFileNameAsync(int userId, string fileName);
        Task<IEnumerable<FileImport>> GetAllByUserIdAsync(int userId);

        Task<FileImport> AddAsync(FileImport fileImport);
    }
}
