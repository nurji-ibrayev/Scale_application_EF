using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scale_application.Models.Entities
{
    public class Product
    {
        public Guid ProductId { get; set; }
        public string CategoryName { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }

        [Required]
        public string Price { get; set; }

        public List<AdditionalFieldValue> AdditionalFields { get; set; }
    }

    public class AdditionalFieldValue
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        [ForeignKey("ProductId")]
        public Guid ProductId { get; set; }
    }
}