import { addToCart, cartTotal } from './cart-utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container');
  const cartBadge = document.querySelector('.cart-counter');
  const titleEl   = document.getElementById('title');

  loadProducts();

  /* ---------- PRODUCTS LOAD ---------- */
  function loadProducts() {
    const params   = new URLSearchParams(location.search);
    const gender   = params.get('gender');
    const category = params.get('category');

    // page title
    if (gender) {
      titleEl.textContent = gender === 'девочка' ? 'Қыздар киімдері' : 'Ұлдар киімдері';
    } else if (category) {
      titleEl.textContent = `${category} киімдері`;
    }

    fetch(`http://localhost:3000/api/products?${params.toString()}`)
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(renderGrid)
      .catch(err => {
        console.error(err);
        container.innerHTML =
          `<div class="alert alert-danger">Қате: деректер жүктелмеді (${err.message})</div>`;
      });
  }

  /* ---------- RENDER GRID ---------- */
  function renderGrid(products) {
    if (!products.length) {
      container.innerHTML = '<p class="text-center py-5">Тауар табылмады.</p>';
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
        <a href="product.html?id=${p.id}" class="text-decoration-none">
          <div class="product-card h-100">
            <img src="images/${p.image_url}" alt="${p.name}" class="product-img">
            ${p.is_sale         ? '<span class="badge badge-sale">Жеңілдік</span>'          : ''}
            ${p.is_free_shipping? '<span class="badge badge-free">Тегін жеткізу</span>'    : ''}
            <div class="product-info">
              <h5>${p.name}</h5>
              <p class="product-desc">${p.description || ''}</p>
              <div class="price">
                <span class="current-price">${Number(p.price).toLocaleString()} ₸</span>
                ${p.old_price
                    ? `<span class="old-price">${Number(p.old_price).toLocaleString()} ₸</span>`
                    : ''
                }
              </div>
              <button class="btn btn-primary btn-cart"
                      data-id="${p.id}"
                      data-name="${p.name}"
                      data-price="${p.price}">
                Себетке қосу
              </button>
            </div>
          </div>
        </a>
      </div>
    `).join('');

    container.addEventListener('click', handleProductClick);
    updateCartBadge();
  }

  /* ---------- EVENTS ---------- */
  function handleProductClick(e) {
    const btn = e.target.closest('.btn-cart');
    if (!btn) return;
    addToCart(btn.dataset);
    updateCartBadge();
  }

  /* ---------- CART BADGE ---------- */
  function updateCartBadge() {
    const total = cartTotal();
    cartBadge.textContent   = total;
    cartBadge.style.display = total > 0 ? 'flex' : 'none';
  }
});
