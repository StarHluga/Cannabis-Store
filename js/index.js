import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { addToCart, loadCart } from './cart.js'  // import the cart function

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW9ka3hmYXd5ZmdvYnhicGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzY3MTcsImV4cCI6MjA3MjMxMjcxN30.757LLeS2UeR6VPLiGWaK6awYQvYe_B_rkaVDrA_w4SM'
const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ Load products from Supabase
async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*')

  if (error) {
    console.error("Error fetching products:", error)
    return
  }

  displayProducts(products)
}

// ✅ Render products into the page
function displayProducts(products) {
  const container = document.getElementById("products-list")
  let html = ""

  products.forEach(product => {
    html += `
      <div class="product-card">
        <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.name}" width="150"/>
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>R${product.price}</p>
        <button data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
      </div>
    `
  })

  container.innerHTML = html

  // Attach event listeners
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id, btn.dataset.name, Number(btn.dataset.price))
    })
  })
}

// ✅ Initialize products on page load
window.onload = () => {
  loadProducts()
  loadCart()
}
  // Expose addToCart to global scope
  window.addToCart = addToCart
