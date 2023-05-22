const categorySelection = document.getElementById('category_selection');
const productCreation = document.getElementById('product_creation');
const creationStatus = document.getElementById('creation_status');
const productsContainer = document.getElementById('products_container');
let productsList = [];

function categorySelectionChanged()
{
	let additionalFields = document.getElementsByClassName('additional_fields');

	for(var i = additionalFields.length - 1; i >= 0; i--)
	{
        additionalFields[i].parentNode.removeChild(additionalFields[i]);
	}

    getCategoriesFields(categorySelection.options[categorySelection.selectedIndex].value);
}

async function getCategoriesList()
{
	let categoriesList = [];

	await fetch('https://localhost:7238/api/categories').then((response) => {return response.json();}).then((data) =>
	{
		data.value.forEach(category =>
		{
			if (category != '__EFMigrationsHistory')
			{
				categoriesList.push(category);
			}
		});
	});

	for (var i = 0; i < categoriesList.length; i++)
	{
	    var option = document.createElement("option");
	    option.value = categoriesList[i];
	    option.text = categoriesList[i];
	    categorySelection.appendChild(option);
	}
}

async function getCategoriesFields(categoryName)
{
	await fetch(`https://localhost:7238/api/Products/${categoryName}`).then((response) => {return response.json();}).then((data) =>
	{
		Object.keys(data.value).forEach(fieldName =>
		{
			if(fieldName != "ID" && fieldName != "CategoryName")
			{
				var label = document.createElement('label');
				label.classList.add("additional_fields");
				if (fieldName == "Name" || fieldName == "Price")
				{
					label.innerHTML = fieldName + "*";
				}
				else
				{
					label.innerHTML = fieldName;
				}
				productCreation.appendChild(label);

				let input = document.createElement('input');
				input.id = fieldName;
				input.classList.add("additional_fields");
				input.placeholder = "Add " + data.value[fieldName] + " value";
				productCreation.appendChild(input);
			}
		});
	});
}

async function insertProduct()
{
	var fieldsDictionary = new Object();
	fieldsDictionary["CategoryName"] = categorySelection.options[categorySelection.selectedIndex].value;
	let additionalFields = document.getElementsByTagName('input');

	for(var additionalField of additionalFields)
	{
		if (additionalField.value != "")
		{
			fieldsDictionary[additionalField.id] = additionalField.value;
		}
	}

	if ('Name' in fieldsDictionary && 'Price' in fieldsDictionary)
	{
		await fetch('https://localhost:7238/api/products',
		{
		    method: "POST",
		    body: JSON.stringify(fieldsDictionary),
		    headers: { 'content-type': 'application/json' }
		}).then((response) => {return response.json();}).then((data) =>
		{
			creationStatus.innerHTML = data.value;
		});

		creationStatus.style.background = "lime";
		creationStatus.style.color = "black";
		creationStatus.style.visibility = "visible";
		setTimeout(() => 
		{
			location.reload();
		}, 5000);
	}
	else
	{
		creationStatus.innerHTML = "Fill required(*) fields";
		creationStatus.style.background = "red";
		creationStatus.style.color = "white";
		creationStatus.style.visibility = "visible";
	}
}

async function displayProducts()
{
	await fetch('https://localhost:7238/api/products').then((response) => {return response.json();}).then((data) =>
	{
		let allProducts = '';
		productsDictionary = data.value;

		data.value.forEach(product =>
		{
			if (product["CategoryName"] != '__EFMigrationsHistory')
			{
				const productElement = `<div class="product" data-id="${product["ID"]}" onclick="loadPage('${product["CategoryName"]}', ${product["ID"]})"><img src="${product["Image"]}"></img><h3>${product["Name"]}</h3><span>${product["Price"]} тг</span></div>`;
				allProducts += productElement;
			}
		});

		productsContainer.innerHTML = allProducts;
	});
}

async function displayProduct(categoryName, id)
{
	await fetch(`https://localhost:7238/api/Products/${categoryName}&${id}`).then((response) => {return response.json();}).then((data) => 
	{
		const productImage = document.getElementById('product_image');
		const productInformation = document.getElementById('product_information');
		const productCategory = document.getElementById('product_category');
		const productName = document.getElementById('product_name');
		const productPrice = document.getElementById('product_price');
		const productDescription = document.getElementById('product_description');

		productImage.src = data.value["Image"]
		productCategory.innerHTML = data.value["CategoryName"];
		productName.innerHTML = data.value["Name"];
		productPrice.innerHTML = data.value["Price"] + " тг";
		productDescription.innerHTML = data.value["Description"];

		for (var fieldName of Object.keys(data.value))
		{
			if (fieldName != "CategoryName" && fieldName != "ID" && fieldName != "Image" && fieldName != "Name" && fieldName != "Price" && fieldName != "Description")
			{
				var label = document.createElement('label');
				label.classList.add("additional_fields");
				label.innerHTML = fieldName + ":";
				productInformation.appendChild(label);

				let span = document.createElement('span');
				span.classList.add("additional_fields");
				span.innerHTML = data.value[fieldName];
				productInformation.appendChild(span);
			}
		}
	});
}

function loadPage(categoryName, id)
{
	document.body.innerHTML = '<!DOCTYPE html><head><meta charset="UTF-8"><title>Scale_application - View product</title><link rel="stylesheet" href="../style.css"></head><header><nav><a href="../index.html">Product categories</a><a href="../product_creation/index.html">Product creation</a><a href="../products_list/index.html">Products list</a><a href="#">View product</a></nav></header><body><div class="container"><h2>View product</h2><div class="product_view"><img id="product_image"><div class="product_information" id="product_information"><label>Category:</label><span id="product_category"></span><label>Name:</label><span id="product_name"></span><label>Price:</label><span id="product_price"></span><label>Description:</label><span id="product_description"></span></div></div></div><script src="../js/product.js"></script></body></html>';

	displayProduct(categoryName, id);
}

function filterProducts()
{
	let filteredProducts = '';

	for (var product of productsDictionary)
	{
		if (categorySelection.options[categorySelection.selectedIndex].value != "All products")
		{
			if (product["CategoryName"] == categorySelection.options[categorySelection.selectedIndex].value)
			{
				const productElement = `<div class="product" data-id="${product["ID"]}" onclick="loadPage('${product["CategoryName"]}', ${product["ID"]})"><img src="${product["Image"]}"></img><h3>${product["Name"]}</h3><span>${product["Price"]} тг</span></div>`;
				filteredProducts += productElement;
			}
		}
		else
		{
			displayProducts();
		}
	}

	productsContainer.innerHTML = filteredProducts;
}