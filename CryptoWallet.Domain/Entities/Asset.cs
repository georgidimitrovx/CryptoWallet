using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoWallet.Domain.Entities
{
    public class Asset
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public string Ticker { get; set; }
        public DateTime PurchasedOn { get; set; }
        public double Amount { get; set; }
        public double Price { get; set; }

        public User User { get; set; }
    }
}
