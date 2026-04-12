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
    cartState = res.data;
    notify();
  } catch (err) {
    console.error('Failed to fetch cart:', err);
  }
  return cartState;
}

/**
 * Add item to cart
 */
export async function addItem(productId, quantity = 1) {
  const res = await api.addToCart(productId, quantity);
  cartState = res.data;
  notify();
  return cartState;
}

/**
 * Update item quantity
 */
export async function updateItem(productId, quantity) {
  const res = await api.updateCartItem(productId, quantity);
  cartState = res.data;
  notify();
  return cartState;
}

/**
 * Remove item from cart
 */
export async function removeItem(productId) {
  const res = await api.removeFromCart(productId);
  cartState = res.data;
  notify();
  return cartState;
}

/**
 * Clear entire cart
 */
export async function clearAll() {
  const res = await api.clearCart();
  cartState = res.data;
  notify();
  return cartState;
}
