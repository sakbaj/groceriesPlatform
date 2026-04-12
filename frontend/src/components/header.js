/**
 * Header component with navigation and cart badge
 */

import * as store from '../store.js';
import { getCurrentRoute } from '../router.js';

export function renderHeader() {
  const headerEl = document.getElementById('app-header');
  const cart = store.getState();

  const currentPath = getCurrentRoute();

  headerEl.innerHTML = `
    <nav class="header">
      <div class="header-inner">
        <a href="#/" class="header-logo" id="logo-link">
          <span class="header-logo-icon">🛒</span>
          <span class="header-logo-text">Quickbasket</span>
        </a>
        <div class="header-nav">
          <a href="#/" class="header-nav-link ${currentPath === '/' ? 'active' : ''}" id="nav-home">
            <span>🏪</span>
            <span>Shop</span>
          </a>
          <a href="#/cart" class="header-nav-link ${currentPath === '/cart' ? 'active' : ''}" id="nav-cart">
            <span>🛒</span>
            <span>Cart</span>
            <span class="cart-badge ${cart.itemCount === 0 ? 'empty' : ''}" id="cart-badge">${cart.itemCount}</span>
          </a>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Update just the cart badge without full re-render
 */
export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const cart = store.getState();
    badge.textContent = cart.itemCount;
    badge.className = `cart-badge ${cart.itemCount === 0 ? 'empty' : ''}`;

    // Trigger pop animation
    if (cart.itemCount > 0) {
      badge.style.animation = 'none';
      badge.offsetHeight; // Force reflow
      badge.style.animation = '';
    }
  }
}

// Subscribe to cart changes
store.subscribe(() => updateCartBadge());
