namespace CryptoWallet.Application.DTOs
{
    public class CoinloreResponse
    {
        public List<CoinloreResponseCoin> Data { get; set; }
        public CoinloreResponseInfo Info { get; set; }

        public class CoinloreResponseCoin
        {
            public string Id { get; set; }
            public string Symbol { get; set; }
            //public string Name { get; set; }
            //public string Nameid { get; set; }
            //public int Rank { get; set; }
            public string PriceUsd { get; set; }
            //public string PercentChange24h { get; set; }
            //public string PercentChange1h { get; set; }
            //public string PercentChange7d { get; set; }
            //public string PriceBtc { get; set; }
            //public string MarketCapUsd { get; set; }
            //public double Volume24 { get; set; }
            //public double Volume24a { get; set; }
            //public string Csupply { get; set; }
            //public string Tsupply { get; set; }
            //public string Msupply { get; set; }
        }

        public class CoinloreResponseInfo
        {
            public int CoinsNum { get; set; }
            public long Time { get; set; }
        }

        // Method to get coin information by symbol
        public CoinloreResponseCoin GetCoinInfo(string symbol)
        {
            var coin = Data.Find(c => c.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));
            return coin;
        }
    }
}
