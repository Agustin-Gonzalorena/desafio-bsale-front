"use strict";

const URL = 'https://bsale-gonzalorena.herokuapp.com/api/products';
const URL_Category = 'https://bsale-gonzalorena.herokuapp.com/api/categories';

let categories = [];
let products = [];
let newProducts = [];
let cont = 0;

getAll();
getAllCategory();
async function getAll($params = "") {
    let card = document.querySelector("#container-cards");
    card.innerHTML = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;
    try {
        let response = await fetch(URL + $params);
        if (response.status == 404) {
            let products = document.querySelector("#container-cards");
            products.innerHTML = "<h1>Producto no encontrado</h1>";
            return;
        }
        products = await response.json();

        pagination(0);

    } catch (e) {
        console.log(e);
    }
}

function getFilter(e) {
    e.preventDefault();
    let id = e.target.dataset.product;
    let $params = `?filter=${id}`;
    getAll($params);
}

function search(e) {
    e.preventDefault();
    let search = document.querySelector("#btn-search").value;
    let $params = `?search=${search}`;
    getAll($params);
}

function pagination(params) {
    newProducts = [];
    cont = params;
    for (let i = params; i < products.length; i++) {
        if (i == params + 8) {
            break;
        } else {
            newProducts.push(products[i]);
        }
    }
    showProducts(newProducts);
}

function showProducts(params) {
    let card = document.querySelector("#container-cards");
    card.innerHTML = "";
    for (const product of params) {

        let html = `
        <div class="card" style="width: 18rem;">
            <img src="${product.url_image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
            </div>
        </div>`

        card.innerHTML += html;
    }
}

//Category

async function getAllCategory() {
    try {
        let response = await fetch(URL_Category);
        if (!response.ok) {
            throw new Error('Recurso no existe');
        }
        categories = await response.json();

        showCategories();
    } catch (e) {
        console.log(e);
    }

}

function showCategories() {
    let ul = document.querySelector("#category");
    ul.innerHTML = "";
    for (const category of categories) {

        let html = `
        <li type="button" data-product="${category.id}" class="item">${category.name.toUpperCase()}</li > `

        ul.innerHTML += html;

    }
    const btnsCategory = document.querySelectorAll('li.item');
    for (const btnCategory of btnsCategory) {
        btnCategory.addEventListener('click', getFilter);
    }
}

document.querySelector("#previous").addEventListener('click', () => {
    if (cont == 0) {
        return;
    }
    pagination(cont - 8);
})
document.querySelector("#next").addEventListener('click', () => {
    if (cont == products.length - 1) {
        return;
    }
    pagination(cont + 8);
})
document.querySelector("#pagination1").addEventListener("click", () => pagination(0));
document.querySelector("#pagination2").addEventListener("click", () => pagination(8));
document.querySelector("#pagination3").addEventListener("click", () => pagination(16));

document.querySelector("#form-search").addEventListener('submit', search);

document.querySelector("#maxPrice").addEventListener('click', () => {
    products.sort((a, b) => b.price - a.price);
    pagination(0);
});
document.querySelector("#minPrice").addEventListener('click', () => {
    products.sort((a, b) => a.price - b.price);
    pagination(0);
})


