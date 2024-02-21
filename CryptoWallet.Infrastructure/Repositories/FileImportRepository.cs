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
            var inserted = _context.FileImports.Add(file);
            await _context.SaveChangesAsync();
            return inserted.Entity;
        }

        public async Task<IEnumerable<FileImport>> GetAllByUserIdAsync(int userId)
        {
            return await _context.FileImports
                .Where(file => file.UserId == userId)
                .OrderByDescending(file => file.UploadTime)
                .ToListAsync();
        }

        public async Task<FileImport> GetByUserIdAndFileNameAsync(int userId, string fileName)
        {
            return await _context.FileImports
                .FirstOrDefaultAsync(file => file.UserId == userId && file.FileName == fileName);
        }

        public async Task<FileImport> GetFirstByUserIdAsync(int userId)
        {
            return await _context.FileImports
                .FirstOrDefaultAsync(file => file.UserId == userId);
        }
    }
}
