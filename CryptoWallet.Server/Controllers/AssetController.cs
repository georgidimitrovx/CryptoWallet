using CryptoWallet.Application.DTOs;
using CryptoWallet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CryptoWallet.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AssetController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAssetService _assetService;
        private readonly ICoinloreService _coinloreService;

        public AssetController(IUserService userService,
            IAssetService assetService,
            ICoinloreService coinloreService)
        {
            _userService = userService;
            _assetService = assetService;
            _coinloreService = coinloreService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUserAssetsAsync(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return BadRequest(new { message = "Invalid user credentials." });

            var records = await _assetService.GetAllByUserIdAsync(user.Id);
            if (records.Count() == 0)
                return NotFound(new { message = "No assets found" });

            var resultRecords = new AssetDto[records.Count()];
            for (int i = 0; i < resultRecords.Length; i++)
            {
                resultRecords[i] = new AssetDto();
                resultRecords[i].Ticker = records[i].Ticker;
                resultRecords[i].PurchasedOn = records[i].PurchasedOn;
                resultRecords[i].Amount = records[i].Amount;
                resultRecords[i].Price = records[i].Price;
            }

            return Ok(resultRecords);
        }

        [HttpPost("getRealtimeAssets")]
        public async Task<IActionResult> GetRealtimeUserAssetsAsync(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return BadRequest(new { message = "Invalid user credentials." });

            var loadedRecords = await _assetService.GetAllByUserIdAsync(user.Id);
            if (loadedRecords.Count() == 0)
                return NotFound(new { message = "No files found" });

            var resultRecords = new AssetDto[loadedRecords.Count()];
            var dateNow = DateTime.UtcNow;

            for (int i = 0; i < loadedRecords.Count(); i++)
            {
                resultRecords[i] = new AssetDto();
                resultRecords[i].Ticker = loadedRecords[i].Ticker;
                resultRecords[i].Amount = loadedRecords[i].Amount;
                resultRecords[i].PurchasedOn = dateNow;
                resultRecords[i].Price = await _coinloreService.GetTickerPriceAsync(
                    loadedRecords[i].Ticker);
            }

            return Ok(resultRecords);
        }
    }
}
