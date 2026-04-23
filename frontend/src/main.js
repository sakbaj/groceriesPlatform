/**
 * Quickbasket — Main Application Entry Point
 */

import { addRoute, initRouter } from './router.js';
import { fetchCart } from './store.js';
import { renderHomePage } from './pages/home.js';
import { renderCartPage } from './pages/cart.js';
import { renderCheckoutPage } from './pages/checkout.js';
import { renderLoginPage } from './pages/login.js';
import { renderSignupPage } from './pages/signup.js';
import { renderOrdersPage } from './pages/orders.js';
import { renderAnalyticsPage } from './pages/analytics.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';

// Register routes
addRoute('/', renderHomePage);
addRoute('/cart', renderCartPage);
addRoute('/checkout', renderCheckoutPage);
addRoute('/login', renderLoginPage);
addRoute('/signup', renderSignupPage);
addRoute('/orders', renderOrdersPage);
addRoute('/analytics', renderAnalyticsPage);

// Initialize the app
async function init() {
  // Render static components
  renderHeader();
  renderFooter();

  // Listen to route changes to update header active states
  window.addEventListener('hashchange', renderHeader);

  // Fetch initial cart state
  await fetchCart();

  // Start the router (renders the current page)
  initRouter();
}

init().catch(err => {
  console.error('Failed to initialize Quickbasket:', err);
  document.getElementById('app-main').innerHTML = `
    <div style="text-align: center; padding: 4rem 1rem;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
      <h2 style="margin-bottom: 0.5rem;">Connection Error</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
        Could not connect to the Quickbasket server.<br>
        Make sure the backend is running on port 3001.
      </p>
      <button onclick="location.reload()" 
        style="padding: 0.75rem 2rem; background: var(--accent); color: #0a0e17; border: none; border-radius: 0.75rem; font-weight: 600; cursor: pointer; font-family: var(--font);">
        Retry
      </button>
    </div>
  `;
});
