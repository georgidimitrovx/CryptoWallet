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
        private readonly ITransactionManager _transactionManager;

        public AssetController(IUserService userService,
            IAssetService assetService,
            ICoinloreService coinloreService,
            ITransactionManager transactionManager)
        {
            _userService = userService;
            _assetService = assetService;
            _coinloreService = coinloreService;
            _transactionManager = transactionManager;
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

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshAsync(string email)
        {
            if (!await _coinloreService.SaveAllTickerIdsAsync())
                return BadRequest(new { message = "Failed to load data from Coinlore." });

            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return BadRequest(new { message = "Invalid user credentials." });

            var records = await _assetService.GetAllByUserIdAsync(user.Id);
            if (records.Count() == 0)
                return NotFound(new { message = "No files found" });

            foreach (var asset in records)
            {
                asset.Price = await _coinloreService.GetTickerPriceAsync(asset.Ticker);
                asset.Id = 0;
                asset.PurchasedOn = DateTime.UtcNow;
            }

            try
            {
                _transactionManager.BeginTransaction();

                foreach (var asset in records)
                {
                    if (await _assetService.AddAsync(asset) == null)
                        throw new Exception("Error adding asset");
                }

                await _transactionManager.CommitAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                _transactionManager.Rollback();
                return BadRequest(new { message = "Error in transaction" });
            }

            return Ok();

        }
    }
}
