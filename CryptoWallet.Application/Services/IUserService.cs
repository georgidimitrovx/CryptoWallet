using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Application.Services
{
    public interface IUserService
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
    }
}
