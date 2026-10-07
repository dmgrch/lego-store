const cartButton = document.querySelector(".cart-button");
const cartOverlay = document.querySelector(".cart-overlay");
const cartCloseButton = document.querySelector(".cart__close");
const cartItems = document.querySelector(".cart__items");
const cartTotal = document.querySelector(".cart__total");
const cartCount = document.querySelector(".cart-button__count");
const cartMessage = document.querySelector(".cart__message");
const productButtons = document.querySelectorAll(".product-card__button");

let cart = [];
let messageTimer;

function openCart() {
    cartOverlay.classList.add("cart-overlay--open");
    document.body.classList.add("body--locked");
}

function closeCart() {
    cartOverlay.classList.remove("cart-overlay--open");
    document.body.classList.remove("body--locked");
}

function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function calculateTotal() {
    return cart.reduce((total, product) => {
        return total + product.price * product.quantity;
    }, 0);
}

function calculateCount() {
    return cart.reduce((total, product) => {
        return total + product.quantity;
    }, 0);
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Корзина пока пуста.</p>";
    } else {
        cartItems.innerHTML = cart.map((product) => {
            return `
                <div class="cart-item">
                    <p class="cart-item__name">${product.name}</p>

                    <div class="cart-item__controls">
                        <button
                            class="cart-item__quantity-button"
                            type="button"
                            data-action="decrease"
                            data-id="${product.id}"
                        >
                            −
                        </button>

                        <span class="cart-item__quantity">
                            ${product.quantity}
                        </span>

                        <button
                            class="cart-item__quantity-button"
                            type="button"
                            data-action="increase"
                            data-id="${product.id}"
                        >
                            +
                        </button>
                    </div>

                    <div class="cart-item__bottom">
                        <span class="cart-item__price">
                            ${formatPrice(product.price * product.quantity)}
                        </span>

                        <button
                            class="cart-item__remove"
                            type="button"
                            data-id="${product.id}"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }

    cartTotal.textContent = formatPrice(calculateTotal());
    cartCount.textContent = calculateCount();
}

function showAddedMessage() {
    cartMessage.classList.add("cart__message--visible");

    clearTimeout(messageTimer);

    messageTimer = setTimeout(() => {
        cartMessage.classList.remove("cart__message--visible");
    }, 2000);
}

function addToCart(button) {
    const id = button.dataset.id;
    const existingProduct = cart.find((product) => product.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const product = {
            id: id,
            name: button.dataset.name,
            price: Number(button.dataset.price),
            quantity: 1
        };

        cart.push(product);
    }

    renderCart();
    showAddedMessage();
    openCart();
}

function changeQuantity(id, change) {
    const product = cart.find((product) => product.id === id);

    if (!product) {
        return;
    }

    product.quantity += change;

    if (product.quantity <= 0) {
        cart = cart.filter((product) => product.id !== id);
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter((product) => product.id !== id);

    renderCart();
}

productButtons.forEach((button) => {
    button.addEventListener("click", () => {
        addToCart(button);
    });
});

cartButton.addEventListener("click", openCart);

cartCloseButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", (event) => {
    if (event.target === cartOverlay) {
        closeCart();
    }
});

cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const id = button.dataset.id;

    if (button.dataset.action === "increase") {
        changeQuantity(id, 1);
    }

    if (button.dataset.action === "decrease") {
        changeQuantity(id, -1);
    }

    if (button.classList.contains("cart-item__remove")) {
        removeFromCart(id);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCart();
    }
});