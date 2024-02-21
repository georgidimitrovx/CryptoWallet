using CryptoWallet.Application.Services;
using Microsoft.EntityFrameworkCore.Storage;

namespace CryptoWallet.Infrastructure
{
    public class TransactionManager : ITransactionManager
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction _transaction;

        public TransactionManager(AppDbContext context)
        {
            _context = context;
        }

        public void BeginTransaction()
        {
            _transaction = _context.Database.BeginTransaction();
        }

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
            await _transaction.CommitAsync();
        }

        public void Rollback()
        {
            _transaction.Rollback();
        }
    }
}
