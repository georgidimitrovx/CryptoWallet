using Microsoft.AspNetCore.Http;

namespace CryptoWallet.Application.DTOs
{
    public class FileImportDto
    {
        public string Email { get; set; }
        public IFormFile File { get; set; }
    }
}
