namespace CryptoWallet.Application.DTOs
{
    public class CoinloreResponseInfo
    {
        public int Coins_num { get; set; }
        public long time { get; set; }
    }

    public class CoinloreResponse
    {
        public CoinloreDto[] data { get; set; }
        public CoinloreResponseInfo info { get; set; }
    }
}
