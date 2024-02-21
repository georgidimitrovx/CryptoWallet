namespace CryptoWallet.Application.Services
{
    public interface ITransactionManager
    {
        void BeginTransaction();
        Task CommitAsync();
        void Rollback();
    }
}
