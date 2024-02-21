namespace CryptoWallet.Domain.Entities
{
    public class Coinlore
    {
        public int Id { get; set; }
        public string Ticker { get; set; }
        public int ExternalId { get; set; }
        public DateTime UpdateTime { get; set; }

    }
}
