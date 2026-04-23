/**
 * Cart Store — Reactive state management for cart data
 * Provides cart state with subscriber notifications
 */

import * as api from './api.js';

let cartState = { items: [], total: 0, itemCount: 0 };
const subscribers = [];

/**
 * Subscribe to cart state changes
 * @param {Function} callback - Called with new cart state
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const idx = subscribers.indexOf(callback);
    if (idx > -1) subscribers.splice(idx, 1);
  };
}

function notify() {
  subscribers.forEach(cb => cb(cartState));
}

/**
 * Get current cart state
 */
export function getState() {
  return { ...cartState };
}

/**
 * Fetch cart from server and update state
 */
export async function fetchCart() {
  try {
    const res = await api.getCart();
    if (res.success && res.data) {
      cartState = res.data;
    } else {
      // Not logged in or error — reset to empty cart
      cartState = { items: [], total: 0, itemCount: 0 };
    }
    notify();
  } catch (err) {
    console.error('Failed to fetch cart:', err);
    cartState = { items: [], total: 0, itemCount: 0 };
  }
  return cartState;
}

/**
 * Add item to cart
 */
export async function addItem(productId, quantity = 1) {
  await api.addToCart(productId, quantity);
  // Re-fetch the full cart since the API only returns { success: true }
  return await fetchCart();
}

/**
 * Update item quantity
 */
export async function updateItem(productId, quantity) {
  await api.updateCartItem(productId, quantity);
  // Re-fetch the full cart since the API only returns { success: true }
  return await fetchCart();
}

/**
 * Remove item from cart
 */
export async function removeItem(productId) {
  await api.removeFromCart(productId);
  // Re-fetch the full cart since the API only returns { success: true }
  return await fetchCart();
}

/**
 * Clear entire cart
 */
export async function clearAll() {
  await api.clearCart();
  // Re-fetch the full cart since the API only returns { success: true }
  return await fetchCart();
}
