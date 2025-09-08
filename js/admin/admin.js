// js/admin.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Using .env with dotenv
const supabase = createClient(supabaseUrl, supabaseKey);

// Sidebar navigation
const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.admin-section');

sidebarLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        const pageUrl = link.getAttribute('data-page'); // optional dynamic page

        // Show/hide sections
        sections.forEach(sec => {
            if (sec.id === targetSection) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });

        // Load page dynamically if data-page exists (e.g., profile form)
        if (pageUrl) {
            try {
                const response = await fetch(pageUrl);
                const html = await response.text();
                document.getElementById(targetSection).innerHTML = html;

                // Optionally import JS for that page
                if (pageUrl === 'admin-profile.html') {
                    import('./admin-profile.js');
                }
            } catch (err) {
                document.getElementById(targetSection).innerHTML = `<p>Error loading page: ${err.message}</p>`;
            }
        }

        // Auto-load products if products section clicked
        if (targetSection === 'products') {
            loadProducts();
        }
    });
});

// Fetch products dynamically from Supabase
async function loadProducts() {
    const { data, error } = await supabase.from('products').select('*');

    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (error) {
        container.innerHTML = `<p>Error fetching products: ${error.message}</p>`;
        return;
    }

    data.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${product.image_url || 'placeholder.png'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Quantity: ${product.quantity}</p>
            <p>Price: $${product.price}</p>
        `;
        container.appendChild(div);
    });
}

// Optionally, you can preload the first visible section
const firstSection = sections[0];
if (firstSection && firstSection.id === 'products') {
    loadProducts();
}
