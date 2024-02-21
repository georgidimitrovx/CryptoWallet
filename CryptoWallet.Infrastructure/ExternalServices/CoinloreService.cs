using CryptoWallet.Application.DTOs;
using CryptoWallet.Application.Services;
using CryptoWallet.Domain.Entities;
using CryptoWallet.Domain.RepositoryContracts;
using Newtonsoft.Json;

namespace CryptoWallet.Infrastructure.ExternalServices
{
    public class CoinloreService : ICoinloreService
    {
        private readonly ICoinloreRepository _coinloreRepository;

        public CoinloreService(ICoinloreRepository coinloreRepository)
        {
            _coinloreRepository = coinloreRepository;
        }

        public async Task<int> FetchTickerExternalIdAsync(string ticker)
        {
            var externalId = -1;
            var apiUrl = "https://api.coinlore.net/api/tickers/?start=";
            var startId = 0;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    while (true)
                    {
                        var jsonString = await httpClient.GetStringAsync(apiUrl + startId.ToString());
                        startId += 100;
                        var coinloreResponse = JsonConvert.DeserializeObject<CoinloreResponse>(
                            jsonString);

                        if (coinloreResponse == null ||
                            coinloreResponse.Data == null)
                        {
                            continue;
                        }

                        if (coinloreResponse.Data.Count == 0)
                            break;

                        var coin = coinloreResponse.GetCoinInfo(ticker);
                        if (coin == null)
                            continue;

                        externalId = int.Parse(coin.Id);
                        break;
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"Error fetching data: {e.Message}");
                    return -1;
                }
            }

            return externalId;
        }

        public async Task<int> GetIdByTickerAsync(string ticker)
        {
            var coin = await _coinloreRepository.GetByTickerAsync(ticker);

            if (coin == null || coin.UpdateTime < DateTime.UtcNow.AddHours(-1))
            {
                var externalId = await FetchTickerExternalIdAsync(ticker);

                if (coin == null)
                {
                    coin = new Coinlore();
                    coin.Ticker = ticker;
                    coin.ExternalId = externalId;
                    coin.UpdateTime = DateTime.UtcNow;
                    await _coinloreRepository.AddAsync(coin);
                }
                else
                {
                    coin.ExternalId = externalId;
                    coin.UpdateTime = DateTime.UtcNow;
                    await _coinloreRepository.UpdateAsync(coin);
                }
            }

            return coin.ExternalId;
        }

        public async Task<double> GetTickerPriceAsync(string ticker)
        {
            int externalId = await GetIdByTickerAsync(ticker);
            var apiUrl = $"https://api.coinlore.net/api/ticker/?id={externalId}";
            var price = 0.0;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetStringAsync(apiUrl);

                    // Assuming the API returns a JSON array
                    var data = JsonConvert.DeserializeObject<CoinloreDto[]>(response);

                    if (data == null || data.Length == 0)
                        throw new Exception("No data found for ticker");

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
