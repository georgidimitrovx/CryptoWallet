using CryptoWallet.Infrastructure;

namespace CryptoWallet.Application.Services
{
    public class HeartbeatService : IHeartbeatService
    {
        private readonly AppDbContext _context;

        public HeartbeatService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsDatabaseConnectedAsync()
        {
            try
            {
                return await _context.Database.CanConnectAsync();
            }
            catch
            {
                // Log exception details here as needed
                return false;
            }
        }
    }
}
