using Microsoft.EntityFrameworkCore;
using Scale_application.Models.Entities;

namespace Scale_application.Data
{
    public class ScaleDbContext : DbContext
    {
        public ScaleDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Category> Categories { get; set; }    
        public DbSet<Product> Products { get; set; }
    }
}
