const container = document.getElementById('categories_creation');
const cancelButton = document.getElementById('cancel_button');
const addCategoryButton = document.getElementById('add_category_button');
const categoryName = document.getElementById('category_name');
let additionalName = document.getElementsByClassName('additional_name');
let additionalDatatype = document.getElementsByClassName('additional_datatype');
const saveButton = document.getElementById('save_button');
const categoriesContainer = document.querySelector('#categories_container');
let fieldsAmount = 0;
let categoriesList = '';

addCategoryButton.addEventListener("click", function()
{
	container.style.visibility = "visible";
	categoryName.value = "";

	for(var i = 0; i < fieldsAmount; i++)
	{
		document.getElementById('additional_label_' + i).remove();
		document.getElementById('additional_name_' + i).remove();
		document.getElementById('additional_datatype_' + i).remove();
	}

	fieldsAmount = 0;
});
displayCategories();

function addInput()
{
	let label = document.createElement('label');
	label.id = "additional_label_" + fieldsAmount;
	label.innerHTML = `Additional field ${fieldsAmount + 1} name`;
	container.appendChild(label);

	let input = document.createElement('input');
	input.id = "additional_name_" + fieldsAmount;
	input.classList.add("additional_name");
	input.placeholder = `Add additional field ${fieldsAmount + 1} name`;
	container.appendChild(input);

	//Create and append the options
	for (var i = 0; i < array.length; i++)
	{
	    var option = document.createElement("option");
	    option.value = array[i];
	    option.text = array[i];
	    select_list.appendChild(option);
	}

	fieldsAmount++;
}

async function displayCategories()
{
	await fetch('https://localhost:7238/api/categories').then((response) => {return response.json();}).then((data) =>
	{
		let allCategories = '';

		Object.values(data).forEach(category =>
		{
			if (category != '__EFMigrationsHistory')
			{
				const categoryElement = `<div class="category" data-id="${Object.keys(data)}"><svg id="delete_category" onclick="deleteCategory('${Object.keys(data)}');" fill-rule="evenodd" viewBox="0 0 24 24" height="25"><path d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"/></svg><h3>${category}</h3></div>`;
				allCategories += categoryElement;
			}
		});

		categoriesContainer.innerHTML = allCategories;
	});
}

async function addCategory()
{
	if (categoryName.value != "")
	{
		var fieldsDictionary = new Object();
		fieldsDictionary["CategoryName"] = categoryName.value;

		for(var i = 0; i < additionalName.length; i++)
		{
			if (additionalName[i].value != "")
			{
				fieldsDictionary[additionalName[i].value] = additionalDatatype[i].options[additionalDatatype[i].selectedIndex].value;
			}
		}

		await fetch('https://localhost:7238/api/categories',
		{
		    method: "POST",
		    body: JSON.stringify(fieldsDictionary),
		    headers: { 'content-type': 'application/json' }
		});

		container.style.visibility = "hidden";
		displayCategories();
	}
	else
	{
		categoryName.style.borderColor = "red";
		categoryName.classList.add("fill_required");

		setTimeout(() => 
		{
			categoryName.style.borderColor = "transparent";
			categoryName.classList.remove("fill_required");
		}, 5000);
	}

}

async function deleteCategory(categoryId)
{
    let response = confirm("Are you sure to delete category: " + categoryId + "?");

    if(response)
    {
		await fetch(`https://localhost:7238/api/categories/${categoryId}`,
		{
		    method: "DELETE",
		    headers: { 'content-type': 'application/json' }
		});

		displayCategories();
    }
    else { }
}