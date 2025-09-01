import { addToCart, loadCart } from './cart.js';

// Load products from backend
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to load products");
    const products = await res.json();
    displayProducts(products);
  } catch (err) {
    console.error(err);
    document.getElementById("products-list").innerHTML = "<p>Failed to load products</p>";
  }
}

// Render products
function displayProducts(products) {
  const container = document.getElementById("products-list");
  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.name}" width="150"/>
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>R${product.price}</p>
        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
      </div>
    `;
  });
}

// Initialize
window.onload = () => {
  loadProducts();
  loadCart();
}

// Expose addToCart to global scope
window.addToCart = addToCart;
