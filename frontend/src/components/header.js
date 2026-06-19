/**
 * Header component with navigation, auth, and cart badge
 */

import * as store from '../store.js';
import { getCurrentRoute } from '../router.js';
import { getUser, logout } from '../api.js';

export function renderHeader() {
  const headerEl = document.getElementById('app-header');
  const cart = store.getState();
  const currentPath = getCurrentRoute();
  const user = getUser();

  headerEl.innerHTML = `
    <nav class="header">
      <div class="header-inner">
        <a href="#/" class="header-logo" id="logo-link">
          <span class="header-logo-icon">🛒</span>
          <span class="header-logo-text">Quickbasket</span>
        </a>
        <div class="header-search">
          <span class="header-search-icon">🔍</span>
          <input type="text" id="global-search-input" class="header-search-input" placeholder="Search for fresh groceries..." value="${window.__qb_current_search || ''}">
        </div>
        <div class="header-nav">
          <a href="#/" class="header-nav-link ${currentPath === '/' ? 'active' : ''}">
            <span>Shop</span>
          </a>
          ${user ? `
            <a href="#/orders" class="header-nav-link ${currentPath === '/orders' ? 'active' : ''}">Orders</a>
            <a href="#/analytics" class="header-nav-link ${currentPath === '/analytics' ? 'active' : ''}">Analytics</a>
            <a href="#" id="logout-btn" class="header-nav-link" style="color: var(--text-secondary);">Logout (${user.name})</a>
          ` : `
            <a href="#/login" class="header-nav-link ${currentPath === '/login' ? 'active' : ''}">Login</a>
          `}
          <a href="#/cart" class="header-nav-link header-cart-btn ${currentPath === '/cart' ? 'active' : ''}">
            <span>🛒</span>
            <span class="cart-badge ${cart.itemCount === 0 ? 'empty' : ''}" id="cart-badge">${cart.itemCount}</span>
          </a>
        </div>
      </div>
    </nav>
  `;

  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      window.__qb_current_search = val; // Store globally so it persists header re-renders
      if (window.location.hash !== '#/' && window.location.hash !== '') {
        window.location.hash = '#/';
      }
      window.dispatchEvent(new CustomEvent('qbSearch', { detail: val }));
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
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
