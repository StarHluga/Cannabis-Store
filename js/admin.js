import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY' // ❗ Replace with anon key, never service_role
const supabase = createClient(supabaseUrl, supabaseKey)

// Elements
const productForm = document.getElementById('product-form')
const productsTableBody = document.querySelector('#products-table tbody')

// Load products from Supabase
async function loadProducts() {
    const { data: products, error } = await supabase.from('products').select('*')

    if (error) {
        console.error('Error loading products:', error)
        return
    }

    renderProducts(products)
}

// Render products in table
function renderProducts(products) {
    productsTableBody.innerHTML = ''

    products.forEach(product => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>R${product.price}</td>
            <td>${product.stock_quantity || '-'}</td>
            <td>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        `
        productsTableBody.appendChild(row)
    })

    // Add event listeners for buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id))
    })
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
    })
}

// Add new product
productForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const newProduct = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        stock_quantity: parseInt(document.getElementById('stock_quantity').value) || 0,
        image_url: document.getElementById('image_url').value || ''
    }

    const { error } = await supabase.from('products').insert([newProduct])
    if (error) {
        alert('Error adding product: ' + error.message)
        return
    }

    alert('Product added successfully!')
    productForm.reset()
    loadProducts()
})

// Edit product (fill form with values)
async function editProduct(id) {
    const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error) {
        console.error('Error fetching product:', error)
        return
    }

    // Fill form with existing data
    document.getElementById('name').value = product.name
    document.getElementById('category').value = product.category
    document.getElementById('price').value = product.price
    document.getElementById('stock_quantity').value = product.stock_quantity
    document.getElementById('image_url').value = product.image_url

    // Change form to update mode
    productForm.querySelector('button').textContent = 'Update Product'

    // Handle update on submit
    productForm.onsubmit = async (e) => {
        e.preventDefault()
        const updatedProduct = {
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock_quantity: parseInt(document.getElementById('stock_quantity').value) || 0,
            image_url: document.getElementById('image_url').value || ''
        }

        const { error } = await supabase.from('products').update(updatedProduct).eq('id', id)
        if (error) {
            alert('Error updating product: ' + error.message)
            return
        }

        alert('Product updated successfully!')
        productForm.reset()
        productForm.querySelector('button').textContent = 'Add Product'
        loadProducts()

        // Restore original submit listener
        productForm.onsubmit = addProductListener
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
        alert('Error deleting product: ' + error.message)
        return
    }

    alert('Product deleted successfully!')
    loadProducts()
}

// Keep original listener for adding
function addProductListener(e) {
    e.preventDefault()
    // code from above submit handler
}

// Initial load
loadProducts()
