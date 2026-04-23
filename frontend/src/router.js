/**
 * Simple hash-based router for client-side navigation
 */

const routes = {};
let currentRoute = null;

/**
 * Register a route handler
 * @param {string} path - Route path (e.g., '/', '/cart', '/checkout')
 * @param {Function} handler - Function that renders the page
 */
export function addRoute(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a route
 * @param {string} path - Route to navigate to
 */
export function navigate(path) {
  window.location.hash = path;
}
export const navigateTo = navigate;

/**
 * Get current route from hash
 */
function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

/**
 * Handle route change
 */
async function handleRouteChange() {
  const path = getRoute();

  // Find matching route (supports /order/:id patterns)
  let handler = routes[path];
  let params = {};

  if (!handler) {
    // Check for parameterized routes
    for (const [routePath, routeHandler] of Object.entries(routes)) {
      if (routePath.includes(':')) {
        const routeParts = routePath.split('/');
        const pathParts = path.split('/');

        if (routeParts.length === pathParts.length) {
          let match = true;
          const extractedParams = {};

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              extractedParams[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }

          if (match) {
            handler = routeHandler;
            params = extractedParams;
            break;
          }
        }
      }
    }
  }

  if (handler) {
    currentRoute = path;
    const main = document.getElementById('app-main');
    main.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Loading...</div>';
    try {
      await handler(params);
    } catch (err) {
      console.error('Route error:', err);
      main.innerHTML = `<div class="cart-empty">
        <div class="cart-empty-icon">😵</div>
        <p class="cart-empty-text">Something went wrong. Please try again.</p>
        <button class="btn-shop-now" onclick="location.hash='/'">← Go Home</button>
      </div>`;
    }
  }
}

/**
 * Initialize the router
 */
export function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  // Handle initial load
  handleRouteChange();
}

/**
 * Get current active route
 */
export function getCurrentRoute() {
  return currentRoute || getRoute();
}
