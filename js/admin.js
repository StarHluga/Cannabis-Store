import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW9ka3hmYXd5ZmdvYnhicGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzY3MTcsImV4cCI6MjA3MjMxMjcxN30.757LLeS2UeR6VPLiGWaK6awYQvYe_B_rkaVDrA_w4SM'
const supabase = createClient(supabaseUrl, supabaseKey)


const productForm = document.getElementById('product-form');
const productsTable = document.querySelector('#products-table tbody');

// Load products from Supabase
async function loadProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if(error) return console.error(error);

  productsTable.innerHTML = '';
  products.forEach(p => {
    productsTable.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.price}</td>
        <td>${p.stock_quantity || '-'}</td>
        <td>
          <button onclick="editProduct('${p.id}')">Edit</button>
          <button onclick="deleteProduct('${p.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Add Product
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const product = {
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value),
    stock_quantity: parseInt(document.getElementById('stock_quantity').value) || 0,
    image_url: document.getElementById('image_url').value
  };

  const { data, error } = await supabase.from('products').insert([product]);

  if(error) return console.error(error);

  productForm.reset();
  loadProducts();
});

// Delete Product
async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if(error) return console.error(error);
  loadProducts();
}

// Optional: Edit product logic (can reuse the form with pre-filled values)
async function editProduct(id) {
  const { data } = await supabase.from('products').select('*').eq('id', id).single();

  document.getElementById('name').value = data.name;
  document.getElementById('category').value = data.category;
  document.getElementById('price').value = data.price;
  document.getElementById('stock_quantity').value = data.stock_quantity;
  document.getElementById('image_url').value = data.image_url;

  // Change button to "Update" mode
  productForm.onsubmit = async (e) => {
    e.preventDefault();
    const updated = {
      name: document.getElementById('name').value,
      category: document.getElementById('category').value,
      price: parseFloat(document.getElementById('price').value),
      stock_quantity: parseInt(document.getElementById('stock_quantity').value) || 0,
      image_url: document.getElementById('image_url').value
    };
    await supabase.from('products').update(updated).eq('id', id);
    productForm.reset();
    loadProducts();
    productForm.onsubmit = addProductDefault;
  };
}

function addProductDefault(e) {} // placeholder to reset form submission
