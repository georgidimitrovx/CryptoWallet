using CryptoWallet.Application.DTOs;
using CryptoWallet.Application.Services;
using CryptoWallet.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CryptoWallet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("signUp")]
        public async Task<IActionResult> SignUpAsync(SignUpDto dto)
        {
            // todo validate

            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user != null)
            {
                return BadRequest("User already exists with the provided email");
            }

            user = new User();
            user.Email = dto.Email;
            user.PasswordHash = _authService.HashPassword(dto.Password);

            user = await _userService.CreateAsync(user);
            if (user == null)
            {
                return BadRequest("User creation failed");
            }

            var token = _authService.GenerateJwtToken(dto.Email);
            var tokenExpiry = DateTime.UtcNow.AddHours(1);

            return Ok(new
            {
                token,
                email = user.Email,
                tokenExpiry = ToUnixTimeMilliseconds(tokenExpiry).ToString()
            });
        }


        [HttpPost("signIn")]
        public async Task<IActionResult> SignInAsync(SignInDto dto)
        {
            // todo validate

            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest("User doesn't exist");
            }

            if (!_authService.VerifyPassword(dto.Password, user.PasswordHash))
            {
                return BadRequest("Invalid password");
            }

            var token = _authService.GenerateJwtToken(dto.Email);
            var tokenExpiry = DateTime.UtcNow.AddHours(1);

            return Ok(new
            {
                email = user.Email,
                token,
                tokenExpiry = ToUnixTimeMilliseconds(tokenExpiry).ToString()
            });
        }

        static long ToUnixTimeMilliseconds(DateTime dateTime)
        {
            // Convert dateTime to UTC
            DateTime utcDateTime = dateTime.ToUniversalTime();

            // Unix epoch start
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Calculate milliseconds since the epoch
            long unixTimeMilliseconds = (long)(utcDateTime - epoch).TotalMilliseconds;

            return unixTimeMilliseconds;
        }
    }
}
