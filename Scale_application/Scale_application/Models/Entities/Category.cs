using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scale_application.Models.Entities
{

    public class Category
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public List<AdditionalField>? AdditionalFields { get; set; }
    }

    public class AdditionalField
    {
        public Guid AdditionalFieldId { get; set; }
        public string AdditionalFieldName { get; set; }

        [ForeignKey("CategoryId")]
        public Guid CategoryId { get; set; }
    }
}