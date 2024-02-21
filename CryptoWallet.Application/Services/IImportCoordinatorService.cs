using CryptoWallet.Application.DTOs;
using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Application.Services
{
    public interface IImportCoordinatorService
    {
        Task<bool> ProcessImport(User user, FileImportDto dto);
    }
}
