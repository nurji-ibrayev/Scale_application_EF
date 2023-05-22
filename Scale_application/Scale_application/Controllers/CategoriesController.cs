using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Scale_application.Data;
using Scale_application.Models.Entities;
using System.Data;
using System.Linq;
using System.Net;
using System.Numerics;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Scale_application.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : Controller
    {
        private readonly ScaleDbContext categoriesDbContext;

        public CategoriesController(ScaleDbContext categoriesDbContext)
        {
            this.categoriesDbContext = categoriesDbContext;
        }

        [HttpPost]
        [ActionName("CreateCategory")]
        public async Task<IActionResult> CreateCategory(Category category)
        {
            try
            {
                category.CategoryId = Guid.NewGuid();
                await categoriesDbContext.Categories.AddAsync(category);

                await categoriesDbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(CreateCategory), new { id = category.CategoryId });
            }
            catch(Exception exception)
            {
                return BadRequest(exception);
            }
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] Guid id)
        {
            if (categoriesDbContext.Categories.Find(id) != null)
            {
                IIncludableQueryable<Category, List<AdditionalField>> categoriesList = categoriesDbContext.Categories.Include(category => category.AdditionalFields);
                Category categoryWithFields = new Category();

                foreach (Category category in categoriesList)
                {
                    if (category.CategoryId == id)
                    {
                        categoryWithFields = category;
                    }
                }

                categoriesDbContext.Categories.Remove(categoryWithFields);
                await categoriesDbContext.SaveChangesAsync();

                return Ok(categoryWithFields.CategoryId);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategoriesName()
        {
            try
            {
                DbSet<Category> categoriesList = categoriesDbContext.Categories;

                Dictionary<Guid, string> categoriesDictionary = new Dictionary<Guid, string>();
                foreach (Category category in categoriesList)
                {
                    categoriesDictionary[category.CategoryId] = category.CategoryName;
                }

                return Ok(categoriesDictionary);
            }
            catch (Exception exception)
            {
                return BadRequest(exception);
            }
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetCategoryFields([FromRoute] Guid id)
        {
            if (await categoriesDbContext.Categories.FindAsync(id) != null)
            {
                IIncludableQueryable<Category, List<AdditionalField>> categoriesList = categoriesDbContext.Categories.Include(category => category.AdditionalFields);
                List<string> categoryFields = new List<string>();

                foreach (Category category in categoriesList)
                {
                    if (category.CategoryId == id && category.AdditionalFields != null)
                    {
                        foreach (AdditionalField additionalField in category.AdditionalFields)
                        {
                            categoryFields.Add(additionalField.AdditionalFieldName);
                        }
                    }
                }

                return Ok(categoryFields);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
