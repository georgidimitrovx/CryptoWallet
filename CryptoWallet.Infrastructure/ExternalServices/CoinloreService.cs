using CryptoWallet.Application.DTOs;
using CryptoWallet.Application.Services;
using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using System.Text.Json;

namespace CryptoWallet.Infrastructure.ExternalServices
{
    public class CoinloreService : ICoinloreService
    {
        private readonly ICoinloreRepository _coinloreRepository;

        public CoinloreService(ICoinloreRepository coinloreRepository)
        {
            _coinloreRepository = coinloreRepository;
        }

        public async Task<bool> SaveAllTickerIdsAsync()
        {
            var coinloreRecord = await _coinloreRepository.GetFirstAsync();

            // Don't get new values if cache is fresh
            if (coinloreRecord != null && coinloreRecord.UpdateTime > DateTime.UtcNow.AddHours(-1))
                return true;

            var apiUrl = "https://api.coinlore.net/api/tickers/?start=";
            var startId = 0;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    while (true)
                    {
                        var response = await httpClient.GetStringAsync(apiUrl + startId.ToString());
                        var dataResponse = JsonSerializer.Deserialize<CoinloreResponse>(response);

                        if (dataResponse == null ||
                            dataResponse.data == null ||
                            dataResponse.data.Length == 0)
                        {
                            break;
                        }

                        foreach (var coinDto in dataResponse.data)
                        {
                            if (coinDto.Symbol == "")
                                continue;

                            var coin = await _coinloreRepository.GetByExternalIdAsync(coinDto.Id);

                            if (coin == null)
                            {
                                coin = new Coinlore();
                                coin.Ticker = coinDto.Symbol;
                                coin.ExternalId = coinDto.Id;
                                coin.UpdateTime = DateTime.UtcNow;
                                await _coinloreRepository.AddAsync(coin);
                            }
                            else
                            {
                                coin.Ticker = coinDto.Symbol;
                                coin.ExternalId = coinDto.Id;
                                coin.UpdateTime = DateTime.UtcNow;
                                await _coinloreRepository.UpdateAsync(coin);
                            }
                        }

                        startId += 100;
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"Error fetching data: {e.Message}");
                    return false;
                }
            }

            return true;
        }

        public async Task<int> GetIdByTickerAsync(string ticker)
        {
            await SaveAllTickerIdsAsync();

            var coinlore = await _coinloreRepository.GetByTickerAsync(ticker);

            if (coinlore == null)
                return -1;

            return coinlore.ExternalId;
        }

        public async Task<double> GetTickerPriceAsync(string ticker)
        {
            int id = await GetIdByTickerAsync(ticker);
            var apiUrl = $"https://api.coinlore.net/api/ticker/?id={id}";
            var price = 0.0;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetStringAsync(apiUrl);

                    // Assuming the API returns a JSON array
                    var data = JsonSerializer.Deserialize<CoinloreDto[]>(response);

                    if (data == null || data.Length == 0)
                        throw new Exception("No data");

                    price = data[0].Price_usd;
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"Error fetching data: {e.Message}");
                }
            }

            return price;
        }
    }
}
