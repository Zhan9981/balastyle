import { getCart, saveCart, clearCart, updateBadge } from './cart-utils.js';

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateBadge();

  // Себетті тазалау батырмасы
  document.getElementById('empty-cart').addEventListener('click', () => {
    if (confirm('Себетті толығымен тазалағыңыз келе ме?')) {
      clearCart();
      renderCart();
      updateBadge();
    }
  });
});

// Себетті көрсету функциясы
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="alert alert-info">Себет бос</div>';
    document.getElementById('shipping').textContent = '0 ₸';
    document.getElementById('total').textContent = '0 ₸';
    return;
  }

  let html = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    html += `
      <div class="cart-item" data-id="${item.id}">
        <div class="row">
          <div class="col-md-2">
            <img src="${item.img}" alt="${item.name}" class="img-fluid">
          </div>
          <div class="col-md-4">
            <h5>${item.name}</h5>
            <p>${item.price} ₸</p>
          </div>
          <div class="col-md-3">
            <div class="input-group">
              <button class="btn btn-outline-secondary decrease">-</button>
              <input type="number" class="form-control quantity" value="${item.qty}" min="1">
              <button class="btn btn-outline-secondary increase">+</button>
            </div>
          </div>
          <div class="col-md-2">
            <p class="item-total">${itemTotal} ₸</p>
          </div>
          <div class="col-md-1">
            <button class="btn btn-danger remove-item">×</button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;

  // Жеткізу құнын есептеу (5000 ₸-ден жоғары тапсырыстарға тегін)
  const shipping = subtotal > 5000 ? 0 : 1000;
  const total = subtotal + shipping;

  document.getElementById('shipping').textContent = shipping === 0 ? 'Тегін' : ${shipping} ₸;
  document.getElementById('total').textContent = ${total} ₸;

  // Өнімдерді өзгерту үшін тыңдау қою
  document.querySelectorAll('.decrease').forEach(button => {
    button.addEventListener('click', decreaseQuantity);
  });

  document.querySelectorAll('.increase').forEach(button => {
    button.addEventListener('click', increaseQuantity);
  });

  document.querySelectorAll('.quantity').forEach(input => {
    input.addEventListener('change', updateQuantity);
  });

  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', removeItem);
  });
}

// Санын азайту функциясы
function decreaseQuantity(event) {
  const cartItem = event.target.closest('.cart-item');
  const id = cartItem.dataset.id;
  const cart = getCart();
  const item = cart.find(item => item.id === id);

  if (item.qty > 1) {
    item.qty--;
    saveCart(cart);
    renderCart();
    updateBadge();
  }
}

// Санын көбейту функциясы
function increaseQuantity(event) {
  const cartItem = event.target.closest('.cart-item');
  const id = cartItem.dataset.id;
  const cart = getCart();
  const item = cart.find(item => item.id === id);

  item.qty++;
  saveCart(cart);
  renderCart();
  updateBadge();
}

// Санды тікелей өзгерту функциясы
function updateQuantity(event) {
  const cartItem = event.target.closest('.cart-item');
  const id = cartItem.dataset.id;
  const newQuantity = parseInt(event.target.value);
  const cart = getCart();
  const item = cart.find(item => item.id === id);

  if (newQuantity >= 1) {
    item.qty = newQuantity;
    saveCart(cart);
    renderCart();
    updateBadge();
  }
}

// Өнімді жою функциясы
function removeItem(event) {
  if (confirm('Бұл өнімді себеттен шынымен алып тастағыңыз келе ме?')) {
    const cartItem = event.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== id);

    saveCart(updatedCart);
    renderCart();
    updateBadge();
  }
}