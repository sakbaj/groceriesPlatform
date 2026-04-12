/**
 * Cart Page — View and manage cart items
 */

import * as store from '../store.js';
import { createCartItem } from '../components/cartItem.js';
import { renderHeader } from '../components/header.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';

let unsubscribe = null;

export async function renderCartPage() {
  renderHeader();

  // Fetch latest cart data
  await store.fetchCart();

  const main = document.getElementById('app-main');
  renderCartContent(main);

  // Subscribe to updates for live re-rendering
  if (unsubscribe) unsubscribe();
  unsubscribe = store.subscribe(() => {
    // Check if we're still on the cart page
    if (window.location.hash === '#/cart' || window.location.hash === '') {
      renderCartContent(main);
    }
  });
}

function renderCartContent(main) {
  const cart = store.getState();

  main.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'cart-page fade-in';

  if (cart.items.length === 0) {
    page.innerHTML = `
      <h1 class="page-title">🛒 Your Cart</h1>
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p class="cart-empty-text">Your cart is empty</p>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">
          Browse our fresh selection and add items to your cart
        </p>
        <button class="btn-shop-now" id="btn-shop-now">
          🏪 Start Shopping
        </button>
      </div>
    `;

    main.appendChild(page);

    document.getElementById('btn-shop-now')?.addEventListener('click', () => {
      navigate('/');
    });
    return;
  }

  // Title
  const title = document.createElement('h1');
  title.className = 'page-title';
  title.innerHTML = `🛒 Your Cart <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">(${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''})</span>`;
  page.appendChild(title);

  // Cart items list
  const list = document.createElement('div');
  list.className = 'cart-items-list';
  cart.items.forEach(item => {
    list.appendChild(createCartItem(item));
  });
  page.appendChild(list);

  // Summary
  const summary = document.createElement('div');
  summary.className = 'cart-summary';

  const subtotalItems = cart.items.map(item =>
    `<div class="cart-summary-row">
      <span>${item.product.name} × ${item.quantity}</span>
      <span>₹${item.subtotal.toFixed(2)}</span>
    </div>`
  ).join('');

  summary.innerHTML = `
    ${subtotalItems}
    <div class="cart-summary-row total">
      <span>Total</span>
      <span class="summary-value">₹${cart.total.toFixed(2)}</span>
    </div>
    <button class="btn-checkout" id="btn-checkout">
      Proceed to Checkout →
    </button>
    <button class="btn-clear-cart" id="btn-clear-cart">
      Clear Cart
    </button>
  `;

  page.appendChild(summary);
  main.appendChild(page);

  // Event listeners
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    navigate('/checkout');
  });

  document.getElementById('btn-clear-cart')?.addEventListener('click', async () => {
    try {
      await store.clearAll();
      showToast('Cart cleared', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
