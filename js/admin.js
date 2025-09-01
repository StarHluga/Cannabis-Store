const form = document.getElementById("product-form");
const tableBody = document.querySelector("#products-table tbody");

// --- Fetch & display products ---
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to load products");
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = "<tr><td colspan='5'>Failed to load products</td></tr>";
  }
}

function renderProducts(products) {
  tableBody.innerHTML = "";
  products.forEach(product => {
    tableBody.innerHTML += `
      <tr>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>R${product.price}</td>
        <td>${product.stock_quantity || 0}</td>
        <td>
          <button onclick="editProduct('${product.id}')">Edit</button>
          <button onclick="deleteProduct('${product.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// --- Add / Update product ---
form.addEventListener("submit", async e => {
  e.preventDefault();
  const product = {
    name: form.name.value,
    category: form.category.value,
    price: parseFloat(form.price.value),
    stock_quantity: parseInt(form.stock_quantity.value) || 0,
    image_url: form.image_url.value
  };

  try {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    form.reset();
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to add product");
  }
});

// --- Delete product ---
async function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;
  try {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to delete product");
  }
}

// --- Edit product (pre-fill form) ---
async function editProduct(id) {
  try {
    const res = await fetch(`/api/products`);
    const products = await res.json();
    const product = products.find(p => p.id == id);
    if (!product) return;

    form.name.value = product.name;
    form.category.value = product.category;
    form.price.value = product.price;
    form.stock_quantity.value = product.stock_quantity || 0;
    form.image_url.value = product.image_url;

    // Change submit to update
    form.onsubmit = async e => {
      e.preventDefault();
      const updates = {
        name: form.name.value,
        category: form.category.value,
        price: parseFloat(form.price.value),
        stock_quantity: parseInt(form.stock_quantity.value) || 0,
        image_url: form.image_url.value
      };
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      form.reset();
      loadProducts();
      form.onsubmit = defaultAdd; // Reset to default add
    };
  } catch (err) {
    console.error(err);
    alert("Failed to load product for editing");
  }
}

function defaultAdd(e) {} // placeholder to reset submit

window.deleteProduct = deleteProduct;
window.editProduct = editProduct;

loadProducts();
