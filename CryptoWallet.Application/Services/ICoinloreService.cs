namespace CryptoWallet.Application.Services
{
    public interface ICoinloreService
    {
        Task<int> FetchTickerExternalIdAsync(string ticker);
        Task<double> GetTickerPriceAsync(string ticker);
    }
}
