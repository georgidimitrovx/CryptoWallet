namespace CryptoWallet.Domain.Entities
{
    public class Asset
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Ticker { get; set; }
        public DateTime PurchasedOn { get; set; }
        public double PurchasedAmount { get; set; }
    }
}
