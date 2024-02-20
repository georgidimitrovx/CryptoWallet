using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;

namespace CryptoWallet.Application.Services
{
    public class FileImportService : IFileImportService
    {
        private readonly IFileImportRepository _fileImportRepository;

        public FileImportService(IFileImportRepository fileImportRepository)
        {
            _fileImportRepository = fileImportRepository;
        }

        public async Task<FileImport> GetByUserIdAndFileNameAsync(int userId, string fileName)
        {
            return await _fileImportRepository.GetByUserIdAndFileNameAsync(userId, fileName);
        }

        public async Task<FileImport> AddAsync(FileImport fileImport)
        {
            return await _fileImportRepository.CreateAsync(fileImport);
        }

        public async Task<IEnumerable<FileImport>> GetAllByUserIdAsync(int userId)
        {
            return await _fileImportRepository.GetAllByUserIdAsync(userId);
        }
    }
}
