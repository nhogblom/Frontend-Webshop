// ################################################
// Global state och DOM-referenser
// ################################################

let storeItems = [];
const clearCartButton = document.querySelector("#clearCart");
const burgerMenuButton = document.querySelector("#burgerFilterIcon");
const smallScreenMenu = document.querySelector("#smallDeviceFilterMenu");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutFields = checkoutForm.querySelectorAll(".form-control");

// ################################################
// Produktvisning
// ################################################

// Skriv ut ProductCards baserat på kategori

function renderProductCards(items, category = "all") {
  const productContainer = document.querySelector(".products");
  // rensa innehåll
  productContainer.innerHTML = "";
  // om kategorin är annat än all selektera ut rätt items.
  if (category !== "all") {
    items = items.filter((item) => item.category == category);
  }
  // för varje item skapa ett product card.
  items.forEach((item) => {
    productCardFromItem(item, productContainer);
  });
}

// Skapar ett product card av ett items JSON värden.
function productCardFromItem(item, productContainer) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("product", "col-12", "col-sm-6", "col-lg-4", "p-1");

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
      <h2 class="h6 mb-2">${item.title}</h2>
      <p class="">${item.description}</p>
      <p class="fw-semibold mb-3 mt-auto">$${item.price}</p>
      <button class="btn btn-primary  w-100" onclick="handleAddToCart(this,${item.id})">
        Add to Cart
      </button>
    </div>
  </div>
`;
  productContainer.appendChild(itemElement);
}

// ################################################
// Kundvagn - hjälpfunktioner och localStorage
// ################################################

function cartSize() {
  return getCart().reduce((count, item) => count + item.count, 0);
}

function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// ################################################
// Kundvagn - ändringar i innehåll
// ################################################

// lägg till en produkt i kundvagnen, om produkten redan finns i kundvagnen, öka bara antalet av den produkten

function addToCart(itemId) {
  let cart = getCart();
  let updatedCart = [];
  let itemAlreadyPresentInCart = false;

  cart.forEach((item) => {
    if (item.itemId == itemId) {
      // item already exists in cart, add one to item count and store back to updatedCart, set itemAlreadyPresentInCart to true.
      updatedCart.push({ itemId: itemId, count: item.count + 1 });
      itemAlreadyPresentInCart = true;
    } else {
      // previous cart item did not match incomming itemid, keep in updated cart.
      updatedCart.push(item);
    }
  });
  if (!itemAlreadyPresentInCart) {
    // item was not already in cart, add to updated cart with count 1.
    updatedCart.push({ itemId: itemId, count: 1 });
  }

  saveCartToLocalStorage(updatedCart);
}

// ta bort en produkt helt från kundvagnen, oavsett antal

function removeFromCart(itemId) {
  let cart = getCart();
  let updatedCart = cart.filter((item) => item.itemId != itemId);
  saveCartToLocalStorage(updatedCart);
}

// ändra antalet av en produkt i kundvagnen till ett specifikt antal, om det nya antalet är mindre än 1, ta bort produkten helt från kundvagnen

function changeCartItemQuantity(itemId, newQuantity) {
  newQuantity = Number(newQuantity);
  let cart = getCart();
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
  saveCartToLocalStorage(updatedCart);
}

// ta bort alla produkter från kundvagnen

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

function handleAddToCart(button, itemId) {
  const productCard = button.closest(".product");
  const productImage = productCard.querySelector(".img-container img");
  const cartElement = document.querySelector("#cartButton");

  if (productImage && cartElement) {
    animateImageToCart(productImage, cartElement);
  }

  addToCart(itemId);
}

// ################################################
// Kundvagn - rendering i modal
// ################################################

// rendera alla produkter i kundvagnen i cartModalen, för varje produkt, visa produktbild, titel, pris per styck, antal, summa för den produkten (pris per styck * antal) och knappar för att öka, minska eller ta bort produkten från kundvagnen. Längst ner i modalen, visa den totala summan för alla produkter i kundvagnen.

function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cartItems");
  const cartButton = document.getElementById("cartButton");
  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cartCount");
  const checkoutButton = document.getElementById("goToCheckout");
  const cartTotalContainer = document.getElementById("cartTotal");

  if (cart.length === 0) {
    // sätt default värden om varukorgen är tom.
    cartItemsContainer.innerHTML =
      "<div class='alert alert-warning'>Your cart is empty.</div>";
    cartTotalContainer.innerHTML = "Totalt: 0.00 USD";
    checkoutButton.disabled = true;

    cartIcon.classList.add("text-secondary");
    cartIcon.classList.remove("text-primary");

    cartCount.textContent = "0";
    cartCount.classList.add("d-none");
    return;
  }

  cartIcon.classList.remove("text-secondary");
  cartIcon.classList.add("text-primary");

  cartCount.textContent = cartSize();
  cartCount.classList.remove("d-none");

  checkoutButton.disabled = false;

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
        onclick="changeCartItemQuantity(${item.id}, ${Number(cartItem.count) - 1})"
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
        onclick="changeCartItemQuantity(${item.id}, ${Number(cartItem.count) + 1})"
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

  cartItemsContainer.innerHTML = output;

  // beräkna varukorgens totala orderväre
  const total = cart.reduce((sum, cartItem) => {
    const item = storeItems.find((item) => item.id === cartItem.itemId);
    return sum + item.price * cartItem.count;
  }, 0);

  cartTotalContainer.textContent = `Totalt: ${total.toFixed(2)} USD`;
}

// ################################################
// Checkout och formulärvalidering
// ################################################

// validera enskilt fält
function validateField(field) {
  if (field.checkValidity()) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
    return true;
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
    return false;
  }
}

function manuallyValidateAllInputFields() {
  let formIsValid = true;
  checkoutFields.forEach((field) => {
    if (!validateField(field)) {
      formIsValid = false;
    }
  });
  return formIsValid;
}

function submitOrder(e) {
  e.preventDefault();
  const checkoutModalForm = document.querySelector("#checkoutModal");
  const checkoutModal = bootstrap.Modal.getInstance(checkoutModalForm);

  // validera hela formuläret manuellt, och om det är giltigt, visa bekräftelsemodalen med en bekräftelsemeddelande som innehåller kundens email. Stäng sedan bekräftelsemodalen efter 6 sekunder.
  if (manuallyValidateAllInputFields()) {
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

// ################################################
// Filtreringsmeny
// ################################################

function toggleSmallScreenMenu() {
  smallScreenMenu.classList.toggle("d-none");
}

function handleFilterClick(clickedButton) {
  const buttonText = clickedButton.textContent.trim();
  const filterButtons = document.querySelectorAll(".filterbtn");

  filterButtons.forEach((button) => {
    button.classList.remove("btn-primary", "active");

    if (button.textContent.trim() === buttonText) {
      if (button instanceof HTMLButtonElement) {
        button.classList.add("btn-primary");
      }

      if (button instanceof HTMLLIElement) {
        button.classList.add("active");
      }
    }
  });

  // om knappen som trycktes är en av elementet LI toggla synlighet på burgar menyn
  if (clickedButton instanceof HTMLLIElement) {
    toggleSmallScreenMenu();
  }

  buttonText === "All"
    ? renderProductCards(storeItems)
    : renderProductCards(storeItems, buttonText);
}

function createFilterButtonDesktopMenu(category) {
  const categoryContainer = document.querySelector("#categoryContainer");
  const categoryMenuItem = document.createElement("button");

  categoryMenuItem.classList.add("filterbtn", "btn", "mx-1", "text-capitalize");

  if (category === "All") {
    categoryMenuItem.classList.add("btn-primary");
  }

  categoryMenuItem.innerHTML = category;
  categoryMenuItem.addEventListener("click", () =>
    handleFilterClick(categoryMenuItem),
  );

  categoryContainer.appendChild(categoryMenuItem);
}

function createFilterLiMobileMenu(category) {
  const categorySmallDeviceContainer = document.querySelector(
    "#smallDeviceFilterMenu",
  );
  const categoryListItem = document.createElement("li");
  categoryListItem.classList.add(
    "list-group-item",
    "text-capitalize",
    "filterbtn",
  );
  if (category === "All") {
    categoryListItem.classList.add("list-group-item", "active");
  }
  categoryListItem.innerHTML = category;
  categoryListItem.addEventListener("click", () =>
    handleFilterClick(categoryListItem),
  );
  categorySmallDeviceContainer.appendChild(categoryListItem);
}

function getCategoriesAndCreateFilterMenu() {
  createFilterButtonDesktopMenu("All");
  createFilterLiMobileMenu("All");
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((categories) => {
      categories.forEach((category) => {
        createFilterButtonDesktopMenu(category);
        createFilterLiMobileMenu(category);
      });
    });
}

// ################################################
// Animationer
// ################################################

function animateImageToCart(imgElement, cartElement) {
  const imgRect = imgElement.getBoundingClientRect();
  const targetRect = cartElement.getBoundingClientRect();

  const flyingImg = document.createElement("img");
  flyingImg.src = imgElement.currentSrc || imgElement.src;
  flyingImg.alt = "";

  const startSize = Math.min(imgRect.width, imgRect.height);
  const endSize = Math.max(24, startSize * 0.22);

  const startLeft = imgRect.left + (imgRect.width - startSize) / 2;
  const startTop = imgRect.top + (imgRect.height - startSize) / 2;

  const targetLeft = targetRect.left + (targetRect.width - endSize) / 2;
  const targetTop = targetRect.top + (targetRect.height - endSize) / 2;

  const deltaX = targetLeft - startLeft;
  const deltaY = targetTop - startTop;

  Object.assign(flyingImg.style, {
    position: "fixed",
    left: `${startLeft}px`,
    top: `${startTop}px`,
    width: `${startSize}px`,
    height: `${startSize}px`,
    objectFit: "contain",
    pointerEvents: "none",
    zIndex: "9999",
    opacity: "1",
    transform: "translate(0, 0) scale(1)",
    transformOrigin: "top left",
    transition:
      "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease",
  });

  document.body.appendChild(flyingImg);

  requestAnimationFrame(() => {
    flyingImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${endSize / startSize})`;
    flyingImg.style.opacity = "0.15";
  });

  flyingImg.addEventListener(
    "transitionend",
    () => {
      flyingImg.remove();

      cartElement.classList.add("cart-bounce");
      setTimeout(() => {
        cartElement.classList.remove("cart-bounce");
      }, 300);
    },
    { once: true },
  );
}

// ################################################
// Initiering och event listeners
// ################################################

// Produkterna från fakestori api hämtas omvandlas till JSON och lagras i storeItems, renderProductCards & renderCart anropas.
fetch("https://fakestoreapi.com/products/")
  .then((res) => res.json())
  .then((items) => {
    storeItems = items;
    renderProductCards(items);
    renderCart();
  });

getCategoriesAndCreateFilterMenu();

clearCartButton.addEventListener("click", () => {
  clearCart();
});

burgerMenuButton.addEventListener("click", toggleSmallScreenMenu);

// skapa eventlisteners för varje fält från orderformuläret
checkoutFields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
});
