namespace CryptoWallet.Application.DTOs
{
    public class AssetDto
    {
        public string Ticker { get; set; }
        public DateTime PurchasedOn { get; set; }
        public double Amount { get; set; }
        public double Price { get; set; }
    }
}
