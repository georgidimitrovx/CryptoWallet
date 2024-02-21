namespace CryptoWallet.Application.Services
{
    public interface IHeartbeatService
    {
        Task<bool> IsDatabaseConnectedAsync();
    }
}
