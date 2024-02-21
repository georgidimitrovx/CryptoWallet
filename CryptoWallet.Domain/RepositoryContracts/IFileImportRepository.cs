using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Domain.RepositoryContracts
{
    public interface IFileImportRepository
    {
        Task<FileImport> CreateAsync(FileImport file);
        Task<IEnumerable<FileImport>> GetAllByUserIdAsync(int userId);
        Task<FileImport> GetFirstByUserIdAsync(int userId);
        Task<FileImport> GetByUserIdAndFileNameAsync(int userId, string fileName);
    }
}
