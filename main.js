let storeItems = [];





function displayItems(items) {
    const container = document.querySelector('.products');
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('product', 'col-12', 'col-md-6', 'col-lg-4', 'p-3');
        itemElement.innerHTML = `
        <div class="img-container">
        <img src="${item.image}" alt="${item.title}" />
        </div>
        <div class="product-information">
            <h2>${item.title}</h2>
            <p>Price: $${item.price}</p>
            <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
        `;
        container.appendChild(itemElement);
    });
}

fetch('https://fakestoreapi.com/products/')
    .then(res => res.json())
    .then(items => {
        displayItems(items);
        storeItems = items;
    });


function addToCart(itemId) {
    console.log(`Adding item with ID ${itemId} to cart`);
// todo fixa så den localstorar den.
}

function printStoreItems() {
    console.log("Id 18: " + storeItems.find(item => item.id === 18).title);
    }