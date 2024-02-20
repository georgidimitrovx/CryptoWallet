using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using Microsoft.EntityFrameworkCore;

namespace CryptoWallet.Infrastructure.Repositories
{
    public class FileImportRepository : IFileImportRepository
    {
        private readonly AppDbContext _context;

        public FileImportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FileImport> CreateAsync(FileImport file)
        {
            _context.FileImports.Add(file);
            await _context.SaveChangesAsync();
            return file;
        }

        public async Task<IEnumerable<FileImport>> GetAllByUserIdAsync(int userId)
        {
            return await _context.FileImports
                .Where(file => file.UserId == userId)
                .ToListAsync();
        }

        public async Task<FileImport> GetByUserIdAndFileNameAsync(int userId, string fileName)
        {
            return await _context.FileImports
                .FirstOrDefaultAsync(file => file.UserId == userId && file.FileName == fileName);
        }
    }
}
