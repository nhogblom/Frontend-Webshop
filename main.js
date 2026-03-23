// todo burgermeny skall visas och döljas när man trycker på den
// gå igenom så att det linte ligger någon död kod i js filen samt kolla så att det inte är något knasigt css som jobbar mot varandra. bootstrap vs style.css


let storeItems = [];

// Fetch products from the API and display them on the page

function displayItemsStore(items, category = "all") {
  const container = document.querySelector(".products");
  container.innerHTML = "";
  if (category !== "all") {
    items = items.filter((item) => item.category == category);
  }
  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add(
      "product",
      "col-12",
      "col-sm-6",
      "col-lg-4",
      "p-2",
    );

    itemElement.innerHTML = `
  <div class="card h-100 border-0 shadow-sm">
    <div class="img-container d-flex align-items-center justify-content-center bg-white rounded-top" style="height: 180px;">
      <img 
        src="${item.image}" 
        alt="${item.title}" 
        class="img-fluid w-100 h-100 object-fit-contain p-3"
      />
    </div>

    <div class="card-body d-flex flex-column">
      <h2 class="h6 mb-2 text-truncate">${item.title}</h2>
      <p class="fw-semibold mb-3">$${item.price}</p>
      <button class="btn btn-primary mt-auto w-100" onclick="addToCart(${item.id})">
        Add to Cart
      </button>
    </div>
  </div>
`;
    container.appendChild(itemElement);
  });
}

fetch("https://fakestoreapi.com/products/")
  .then((res) => res.json())
  .then((items) => {
    displayItemsStore(items);
    storeItems = items;
    renderCart();
  });

// Cart functionality ~

// lägg till en produkt i kundvagnen, om produkten redan finns i kundvagnen, öka bara antalet av den produkten

function addToCart(itemId) {
  console.log(`Adding item with ID ${itemId} to cart`);
  let cart = getCart()
  let updatedCart = [];

  let itemAlreadyPresentInCart = false;
  cart.forEach((item) => {
    if (item.itemId == itemId) {
      console.log(`Item with ID ${itemId} already in cart, increasing count`);
      updatedCart.push({ itemId: itemId, count: item.count + 1 });
      itemAlreadyPresentInCart = true;
    } else {
      updatedCart.push(item);
    }
  });
  if (!itemAlreadyPresentInCart) {
    console.log(`Item with ID ${itemId} not in cart, adding new item`);
    updatedCart.push({ itemId: itemId, count: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  renderCart();
}

// ta bort en produkt helt från kundvagnen, oavsett antal

function removeFromCart(itemId) {
  let cart = getCart()
  let updatedCart = cart.filter((item) => item.itemId != itemId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  renderCart();
}

// ändra antalet av en produkt i kundvagnen till ett specifikt antal, om det nya antalet är mindre än 1, ta bort produkten helt från kundvagnen

function changeCartItemQuantity(itemId, newQuantity) {
  newQuantity = Number(newQuantity);
  let cart = getCart()
  let updatedCart = [];
  cart.forEach((item) => {
    if (item.itemId == itemId) {
      if (newQuantity >= 1) {
        updatedCart.push({ itemId: itemId, count: newQuantity });
      }
    } else {
      updatedCart.push(item);
    }
  });
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  renderCart();
}

// ta bort alla produkter från kundvagnen

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

const clearCartButton = document.querySelector("#clearCart");

clearCartButton.addEventListener("click",() => {
  clearCart();
});


function cartSize(){
  let cart = JSON.parse(localStorage.getItem("cart") || [])
  if (cart.length === 0){
    return 0;
  }
  let count = 0;
  cart.forEach((item) => {
    count += (item.count)
  });
  return count;
}

function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}


// rendera alla produkter i kundvagnen i cartModalen, för varje produkt, visa produktbild, titel, pris per styck, antal, summa för den produkten (pris per styck * antal) och knappar för att öka, minska eller ta bort produkten från kundvagnen. Längst ner i modalen, visa den totala summan för alla produkter i kundvagnen.

function renderCart() {
  let cart = getCart()
  const carItemsContainer = document.getElementById("cartItems");
  const cartMenuIcon = document.querySelector("#cartMenu");

  if (cart.length === 0) {
    carItemsContainer.innerHTML =
      "<div class='alert alert-warning'>Your cart is empty.</div>";
    document.getElementById("cartTotal").innerHTML = "Totalt: 0.00 USD";
    document.getElementById("goToCheckout").disabled = true;
    cartMenuIcon.classList.add("text-secondary");
    cartMenuIcon.classList.remove("text-primary");  
    cartMenuIcon.innerHTML = "";
    return;
  }
  cartMenuIcon.classList.remove("text-secondary");
  cartMenuIcon.classList.add("text-primary");
  cartMenuIcon.innerHTML = cartSize();
  document.getElementById("goToCheckout").disabled = false;

  let output = "";
  cart.forEach((cartItem) => {
    const item = storeItems.find((item) => item.id === cartItem.itemId);
    output += `
<div class="border rounded-3 p-3 bg-light">
  <div class="d-flex align-items-center gap-3 mb-3">
    <div class="flex-shrink-0">
      <img
        src="${item.image}"
        alt="${item.title}"
        class="rounded border bg-white p-2 object-fit-contain"
        style="width: 90px; height: 90px;"
      >
    </div>

    <div class="flex-grow-1" style="min-width: 0;">
      <h6 class="mb-1">${item.title}</h6>
      <div class="small text-muted">Price/pcs: ${item.price} USD</div>
    </div>
  </div>

  <div class="d-flex align-items-center justify-content-between gap-3 flex-nowrap">
    
    <div class="d-flex align-items-center gap-2 flex-shrink-0">
      <button
        type="button"
        class="btn btn-sm btn-primary"
        onclick="changeCartItemQuantity(${item.id}, ${(Number(cartItem.count) - 1)})"
      >
        -
      </button>

      <input
        type="number"
        min="1"
        value="${cartItem.count}"
        class="form-control form-control-sm text-center"
        style="width: 70px;"
        onchange="changeCartItemQuantity(${item.id}, this.value)"
      >

      <button
        type="button"
        class="btn btn-sm btn-primary"
        onclick="changeCartItemQuantity(${item.id}, ${(Number(cartItem.count) + 1)})"
      >
        +
      </button>
    </div>

    <div class="text-end ms-auto">
      <div class="small text-muted">Summa</div>
      <div class="fw-bold">${(item.price * cartItem.count).toFixed(2)} USD</div>
    </div>

    <button
      type="button"
      class="btn btn-sm btn-outline-danger flex-shrink-0"
      onclick="removeFromCart(${item.id})"
      title="Remove product"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
</div>
    `;
  });
  carItemsContainer.innerHTML = output;

  const cartTotalContainer = document.getElementById("cartTotal");
  const total = cart.reduce((sum, cartItem) => {
    const item = storeItems.find((item) => item.id === cartItem.itemId);
    return sum + item.price * cartItem.count;
  }, 0);
  cartTotalContainer.textContent = `Totalt: ${total.toFixed(2)} USD`;
}

// Orderformulär och validering ~

// vårat orderformulär i modalen
const checkoutForm = document.getElementById("checkoutForm");

// alla fält i orderformuläret som vi vill validera
const fields = checkoutForm.querySelectorAll(".form-control");

// validera enskilt fält
function validateField(field) {
  if (field.checkValidity()) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }
}

// skapa eventlisteners för varje fält från orderformuläret
fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
});

function manuallyValidateForm() {
  let formIsValid = true;
  fields.forEach((field) => {
    if (!field.checkValidity()) {
      formIsValid = false;
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    }
  });
  return formIsValid;
}

function submitOrder(e) {
  e.preventDefault();
  const checkoutModalForm = document.querySelector("#checkoutModal");
  const checkoutModal = bootstrap.Modal.getInstance(checkoutModalForm);

  // validera hela formuläret manuellt, och om det är giltigt, visa bekräftelsemodalen med en bekräftelsemeddelande som innehåller kundens email. Stäng sedan bekräftelsemodalen efter 6 sekunder.
  if (manuallyValidateForm()) {
    checkoutModal.hide();
    const checkoutOrderModal = document.getElementById(
      "orderConfirmationModal",
    );
    const orderConfirmationModal =
      bootstrap.Modal.getOrCreateInstance(checkoutOrderModal);
    const orderConfirmationMessage = document.getElementById(
      "orderConfirmationMessage",
    );
    const email = document.querySelector('input[type="email"]').value;
    orderConfirmationMessage.innerHTML = `
  <div class="text-center py-3">
    <h4 class="mb-3">Thank you for your order!</h4>
    <p class="mb-2">We have received your order and started processing it.</p>
    <p class="mb-0">An order confirmation has been sent to <strong>${email}</strong>.</p>
  </div>
`;
    orderConfirmationModal.show();
    clearCart();
    setTimeout(() => {
      orderConfirmationModal.hide();
    }, 6000);
  }
}

function createListenersForFilterButtons() {
  const filterButtons = document.querySelectorAll(".filterbtn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        button.classList.add("btn-primary");
      });
      const category = button.innerHTML;
      category === "All"
        ? displayItemsStore(storeItems)
        : displayItemsStore(storeItems, category);
    });
  });
}

function createFilterButton(category) {
  const categoryContainer = document.querySelector("#categoryContainer");
  const categoryMenuItem = document.createElement("button");
  categoryMenuItem.classList.add("filterbtn", "btn", "mx-1", "text-capitalize");
  if (category === "All") {
    categoryMenuItem.classList.add("btn-primary");
  }
  categoryMenuItem.innerHTML = category;
  categoryContainer.appendChild(categoryMenuItem);
}

function getCategories() {
  createFilterButton("All");
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((categories) => {
      categories.forEach((category) => {
        createFilterButton(category);
      });
      createListenersForFilterButtons();
    });
}

getCategories();


