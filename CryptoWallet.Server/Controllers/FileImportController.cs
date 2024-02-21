using CryptoWallet.Application.DTOs;
using CryptoWallet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace CryptoWallet.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FileImportController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFileImportService _fileImportService;
        private readonly IImportCoordinatorService _importCoordinatorService;

        public FileImportController(IUserService userService,
            IFileImportService fileImportService,
            IImportCoordinatorService importCoordinatorService)
        {
            _userService = userService;
            _fileImportService = fileImportService;
            _importCoordinatorService = importCoordinatorService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromForm] FileImportDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid user credentials." });

            var file = await _fileImportService.GetByUserIdAndFileNameAsync(user.Id,
                dto.File.FileName);
            if (file != null)
                return Conflict(new { message = "File already exists." });

            var isFileValid = await _fileImportService.ValidateFile(dto);
            if (!isFileValid)
                return BadRequest(new { message = "Invalid file contents format." });

            var process = await _importCoordinatorService.ProcessImport(user, dto);
            if (!process)
                return BadRequest(new { message = "Error while processing transaction." });

            return Ok(new { message = "File imported successfully!" });
        }


        [HttpGet("getAllByEmail")]
        public async Task<IActionResult> GetAllByEmailAsync(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return BadRequest(new { message = "Invalid user credentials." });

            var records = await _fileImportService.GetAllByUserIdAsync(user.Id);
            if (records.Count() == 0)
                return NotFound(new { message = "No files found" });

            var resultRecords = new FileImportGetDto[records.Count()];
            for (int i = 0; i < resultRecords.Length; i++)
            {
                resultRecords[i] = new FileImportGetDto();
                resultRecords[i].Name = records.ElementAt(i).FileName;
                resultRecords[i].Size = records.ElementAt(i).Size;
                resultRecords[i].UploadTime = records.ElementAt(i).UploadTime.ToString();
                resultRecords[i].FileText = Encoding.UTF8.GetString(records.ElementAt(i).File);
            }

            return Ok(resultRecords);
        }

        [HttpGet("hasFileImport")]
        public async Task<IActionResult> HasFileImportAsync(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return Unauthorized(new { message = "Invalid user credentials." });

            var fileImport = await _fileImportService.HasUserAnyAsync(user.Id);
            if (fileImport == null)
                return NotFound(new { message = "File not found" });

            return Ok(Encoding.UTF8.GetString(fileImport.File));
        }
    }
}
