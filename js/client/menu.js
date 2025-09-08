// js/menu.js

document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      // detect touch/mobile
      if (window.matchMedia("(hover: none)").matches) {
        e.preventDefault();
        const parent = toggle.closest(".dropdown");

        // close others
        document.querySelectorAll(".dropdown").forEach(d => {
          if (d !== parent) d.classList.remove("active");
        });

        // toggle this one
        parent.classList.toggle("active");
      }
    });
  });

  // close if clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("active"));
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // DROPDOWN PRODUCTS (hover + click)
  // ----------------------------
  const dropdowns = document.querySelectorAll(".dropdown");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  // Hover for desktop
  dropdowns.forEach(drop => {
    if (window.matchMedia("(hover: hover)").matches) {
      drop.addEventListener("mouseenter", () => {
        drop.querySelector(".dropdown-content").classList.add("active");
      });
      drop.addEventListener("mouseleave", () => {
        drop.querySelector(".dropdown-content").classList.remove("active");
      });
    }
  });

  // Click for mobile/touch
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      if (window.matchMedia("(hover: none)").matches) {
        e.preventDefault();
        const parent = toggle.closest(".dropdown");

        // Close other dropdowns
        dropdowns.forEach(d => {
          if (d !== parent) d.classList.remove("active");
        });

        parent.classList.toggle("active");
      }
    });
  });

  // Close dropdowns if clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach(d => d.classList.remove("active"));
    }
  });

  // ----------------------------
  // SEARCH & FILTER MODAL LOGIC
  // ----------------------------
  const searchInput = document.getElementById("product-search");
  const filterTHC = document.getElementById("filter-thc");
  const filterCBD = document.getElementById("filter-cbd");
  const filterBenefits = document.getElementById("filter-benefits");
  const filterStrain = document.getElementById("filter-strain");

  const filterModal = document.getElementById("filter-modal");
  const openFilterBtn = document.getElementById("filter-open-btn");
  const closeFilterBtn = document.getElementById("close-filter-btn");
  const applyFilterBtn = document.getElementById("apply-filter-btn");
  const resetFilterBtn = document.getElementById("reset-filter-btn");

  const productsContainer = document.getElementById("products-container");

  // Unified filter/search function
  function filterProducts() {
    const query = searchInput.value.toLowerCase();
    const products = productsContainer.querySelectorAll(".product-card");

    products.forEach(product => {
      const name = product.querySelector("h4").textContent.toLowerCase();
      const matchesSearch = name.includes(query);

      let matchesFilters = true;
      if (filterTHC.checked && product.dataset.thc !== "yes") matchesFilters = false;
      if (filterCBD.checked && product.dataset.cbd !== "yes") matchesFilters = false;
      if (filterBenefits.checked && product.dataset.benefits !== "yes") matchesFilters = false;
      if (filterStrain.checked && product.dataset.strain !== "yes") matchesFilters = false;

      product.style.display = matchesSearch && matchesFilters ? "block" : "none";
    });
  }

  // Search listener
  if (searchInput) searchInput.addEventListener("input", filterProducts);

  // Filter modal open/close
  if (openFilterBtn && filterModal) {
    openFilterBtn.addEventListener("click", () => filterModal.classList.add("active"));
    closeFilterBtn.addEventListener("click", () => filterModal.classList.remove("active"));
    filterModal.addEventListener("click", (e) => {
      if (e.target === filterModal) filterModal.classList.remove("active");
    });
  }

  // Apply filters
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", () => {
      filterProducts();
      filterModal.classList.remove("active");
    });
  }

  // Reset filters
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", () => {
      filterTHC.checked = false;
      filterCBD.checked = false;
      filterBenefits.checked = false;
      filterStrain.checked = false;
      searchInput.value = "";
      filterProducts();
    });
  }
});
