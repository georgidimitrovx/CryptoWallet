namespace CryptoWallet.Application.Services
{
    public interface ICoinloreService
    {
        Task<bool> SaveAllTickerIdsAsync();
        Task<double> GetTickerPriceAsync(string ticker);
    }
}
