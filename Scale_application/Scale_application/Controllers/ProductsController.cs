using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Query;
using Scale_application.Data;
using Scale_application.Models.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Drawing;
using System.Net;
using System.Reflection.PortableExecutable;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;

namespace Scale_application.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly ScaleDbContext categoriesDbContext;

        public ProductsController(ScaleDbContext categoriesDbContext)
        {
            this.categoriesDbContext = categoriesDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                IIncludableQueryable<Product, List<AdditionalFieldValue>> productsList = categoriesDbContext.Products.Include(products => products.AdditionalFields);

                return Ok(productsList);
            }
            catch (Exception exception)
            {
                return BadRequest(exception);
            }
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetProductById([FromRoute] Guid id)
        {
            IIncludableQueryable<Product, List<AdditionalFieldValue>> productsList = categoriesDbContext.Products.Include(products => products.AdditionalFields);
            Product productWithFields = new Product();

            foreach (Product product in productsList)
            {
                if (product.ProductId == id)
                {
                    productWithFields = product;
                }
            }

            if (await categoriesDbContext.Products.FindAsync(id) == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(productWithFields);
            }
        }

        [HttpPost]
        [ActionName("CreateProduct")]
        public async Task<IActionResult> CreateProduct(Product product)
        {
            try
            {
                product.ProductId = Guid.NewGuid();
                await categoriesDbContext.Products.AddAsync(product);

                await categoriesDbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(CreateProduct), new { id = product.ProductId });
            }
            catch (Exception exception)
            {
                return BadRequest(exception);
            }
        }
    }
}
