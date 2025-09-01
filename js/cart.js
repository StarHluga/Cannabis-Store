import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW9ka3hmYXd5ZmdvYnhicGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzY3MTcsImV4cCI6MjA3MjMxMjcxN30.757LLeS2UeR6VPLiGWaK6awYQvYe_B_rkaVDrA_w4SM'
const supabase = createClient(supabaseUrl, supabaseKey)

// Add to cart with quantity
export function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === id)
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1
  } else {
    cart.push({ id, name, price, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  alert(`${name} added to cart!`)
  loadCart()
}

// Load cart and show quantity
export function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartContainer = document.getElementById("cart-items")
  let totalPrice = 0

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>"
    document.getElementById("cart-total").innerText = ""
    return
  }

  // Build HTML once
  let html = ''
  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity
    html += `
      <div class="cart-item">
        <p>${item.name} - R${item.price} x ${item.quantity}</p>
        <button data-index="${index}" class="remove-btn">Remove</button>
        <button data-index="${index}" class="increase-btn">+</button>
        <button data-index="${index}" class="decrease-btn">-</button>
      </div>
    `
  })

  cartContainer.innerHTML = html
  document.getElementById("cart-total").innerText = "Total: R" + totalPrice

  // Add event listeners
  cartContainer.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeItem(Number(btn.dataset.index)))
  })
  cartContainer.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', () => increaseQuantity(Number(btn.dataset.index)))
  })
  cartContainer.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => decreaseQuantity(Number(btn.dataset.index)))
  })
}


// Remove item completely
export function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart.splice(index, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCart()
}

// Increase quantity
export function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart[index].quantity += 1
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCart()
}

// Decrease quantity
export function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1
  } else {
    cart.splice(index, 1)
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCart()
}

// Clear cart
export function clearCart() {
  localStorage.removeItem("cart")
  loadCart()
}

// Checkout with quantity
export async function checkoutCart(userId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  try {
    const { error } = await supabase.from("orders").insert(
      cart.map(item => ({
        user_id: userId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    )

    if (error) throw error

    alert("Checkout successful! Your order has been placed.")
    clearCart()
  } catch (err) {
    console.error("Error during checkout:", err)
    alert("Checkout failed. Please try again.")
  }
}

// Expose functions for HTML buttons
window.removeItem = removeItem
window.clearCart = clearCart
window.checkoutCart = checkoutCart
window.increaseQuantity = increaseQuantity
window.decreaseQuantity = decreaseQuantity
