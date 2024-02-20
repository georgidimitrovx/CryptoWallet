using CryptoWallet.Application.DTOs;
using CryptoWallet.Application.Services;
using CryptoWallet.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CryptoWallet.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FileImportController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFileImportService _fileImportService;

        public FileImportController(IUserService userService, IFileImportService fileImportService)
        {
            _userService = userService;
            _fileImportService = fileImportService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromForm] FileImportDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest("Error validating user");
            }

            var file = await _fileImportService.GetByUserIdAndFileNameAsync(user.Id,
                dto.File.FileName);
            if (file != null)
            {
                return BadRequest("File already exists");
            }

            FileImport newFile = new FileImport();
            newFile.UserId = user.Id;
            newFile.FileName = dto.File.FileName;
            newFile.UploadTime = DateTime.Now;
            newFile.Size = dto.File.Length * 1024;

            using (var memoryStream = new MemoryStream())
            {
                await dto.File.CopyToAsync(memoryStream);
                newFile.File = memoryStream.ToArray();
            }

            var resultFile = await _fileImportService.AddAsync(newFile);
            if (resultFile == null)
            {
                return BadRequest("Failed to create file import record");
            }

            return Ok();
        }


        [HttpGet("getAllByEmail")]
        public async Task<IActionResult> GetAllByEmailAsync(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Error validating user");
            }

            var records = await _fileImportService.GetAllByUserIdAsync(user.Id);
            if (records.Count() == 0)
                return NotFound();

            return Ok(records);
        }
    }
}
