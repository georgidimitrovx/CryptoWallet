using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoWallet.Domain.Entities
{
    public class FileImport
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public string FileName { get; set; }
        public double Size { get; set; }
        public DateTime UploadTime { get; set; }
        public byte[] File { get; set; }

        public User User { get; set; }
    }
}
