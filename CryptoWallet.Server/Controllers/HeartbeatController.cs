using CryptoWallet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CryptoWallet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeartbeatController : ControllerBase
    {
        private readonly IHeartbeatService _heartbeatService;

        public HeartbeatController(IHeartbeatService heartbeatService)
        {
            _heartbeatService = heartbeatService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var isDbConnected = await _heartbeatService.IsDatabaseConnectedAsync();
            if (isDbConnected)
            {
                return Ok("API and database are operational.");
            }
            else
            {
                return StatusCode(503, "API is operational but unable to connect to the database.");
            }
        }
    }
}
