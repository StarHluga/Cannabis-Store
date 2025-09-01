import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW9ka3hmYXd5ZmdvYnhicGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzY3MTcsImV4cCI6MjA3MjMxMjcxN30.757LLeS2UeR6VPLiGWaK6awYQvYe_B_rkaVDrA_w4SM'
const supabase = createClient(supabaseUrl, supabaseKey)


// 🛒 Cart state
let cart = []

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
  const container = document.getElementById("products-listing")
  container.innerHTML = ""

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.name}" width="150"/>
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>R${product.price}</p>
        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
      </div>
    `
  })
}

// ✅ Add to cart
function addToCart(id, name, price) {
  cart.push({ id, name, price })
  console.log("Cart:", cart)
  alert(`${name} added to cart!`)
}

// ✅ Load products when page loads
window.onload = loadProducts
