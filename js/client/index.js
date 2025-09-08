import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseKey);

const productsContainer = document.getElementById('products-container');
let products = []; // store globally for filtering if needed

// ----------------------------
// FETCH PRODUCTS
// ----------------------------
async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data;
}

// ----------------------------
// RENDER PRODUCTS (with image, name, price, THC, CBD, Benefit)
// ----------------------------
function renderProducts(products) {
    productsContainer.innerHTML = '';
    if (!products.length) {
        productsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card product';
        card.dataset.thc = product.category === 'THC' ? 'yes' : 'no';
        card.dataset.cbd = product.category === 'CBD' ? 'yes' : 'no';
        card.dataset.benefits = product.category === 'Benefits' ? 'yes' : 'no';
        card.dataset.strain = product.category === 'Strain' ? 'yes' : 'no';

        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">Price: $${product.price}</p>
            <p class="product-thc">THC: ${product.thc || 'N/A'}%</p>
            <p class="product-cbd">CBD: ${product.cbd || 'N/A'}%</p>
            <p class="product-benefit">Benefit: ${product.benefit || 'N/A'}</p>
        `;
        productsContainer.appendChild(card);
    });

}

// ----------------------------
// INITIAL LOAD
// ----------------------------
document.addEventListener('DOMContentLoaded', async () => {
    products = await fetchProducts(); // store globally
    renderProducts(products);
});


