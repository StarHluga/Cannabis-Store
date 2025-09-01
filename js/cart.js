const userId = "user123"; // Replace with dynamic user ID if you implement login

async function loadCart() {
  const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
  const cart = await res.json();

  const cartContainer = document.getElementById("cart-items");
  let totalPrice = 0;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cart-total").innerText = "";
    return;
  }

  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <p>${item.name} - R${item.price} x ${item.quantity}</p>
        <button onclick="removeItem(${item.id})">Remove</button>
        <button onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
        <button onclick="changeQuantity(${item.id}, ${item.quantity - 1})">-</button>
      </div>
    `;
  });

  document.getElementById("cart-total").innerText = "Total: R" + totalPrice;
}

async function addToCart(product_id, name, price) {
  await fetch(`http://localhost:3000/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, product_id, name, price, quantity: 1 })
  });
  loadCart();
}

async function changeQuantity(id, quantity) {
  if (quantity < 1) return removeItem(id);
  await fetch(`http://localhost:3000/api/cart/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity })
  });
  loadCart();
}

async function removeItem(id) {
  await fetch(`http://localhost:3000/api/cart/${id}`, { method: "DELETE" });
  loadCart();
}

async function clearCart() {
  const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
  const cart = await res.json();
  for (const item of cart) {
    await removeItem(item.id);
  }
}

async function checkoutCart() {
  const res = await fetch(`http://localhost:3000/api/checkout/${userId}`, { method: "POST" });
  const data = await res.json();
  alert(data.message);
  loadCart();
}

// Expose to HTML buttons
window.addToCart = addToCart;
window.removeItem = removeItem;
window.changeQuantity = changeQuantity;
window.clearCart = clearCart;
window.checkoutCart = checkoutCart;

// Load cart on page load
loadCart();
