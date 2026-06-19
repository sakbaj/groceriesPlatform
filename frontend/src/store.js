/**
 * Cart Store — Reactive state management for cart data
 * Provides cart state with subscriber notifications
 */

import * as api from './api.js';

let cartState = { items: [], total: 0, itemCount: 0 };
const subscribers = [];

function saveCart() {
  let total = 0;
  let itemCount = 0;
  
  cartState.items.forEach(item => {
    item.subtotal = item.product.price * item.quantity;
    total += item.subtotal;
    itemCount += item.quantity;
  });
  
  cartState.total = total;
  cartState.itemCount = itemCount;
  
  localStorage.setItem('qb_cart', JSON.stringify(cartState));
  notify();
}

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
  const localCart = localStorage.getItem('qb_cart');
  if (localCart) {
    try {
      cartState = JSON.parse(localCart);
    } catch (e) {
      cartState = { items: [], total: 0, itemCount: 0 };
    }
  } else {
    cartState = { items: [], total: 0, itemCount: 0 };
  }
  notify();
  return cartState;
}

/**
 * Add item to cart
 */
export async function addItem(productId, quantity = 1) {
  const res = await api.getProduct(productId);
  const product = res.data;
  if (!product) throw new Error('Product not found');
  
  const existingItem = cartState.items.find(i => i.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartState.items.push({
      productId,
      quantity,
      product,
      subtotal: product.price * quantity
    });
  }
  
  saveCart();
  return cartState;
}

/**
 * Update item quantity
 */
export async function updateItem(productId, quantity) {
  const existingItem = cartState.items.find(i => i.productId === productId);
  if (existingItem) {
    existingItem.quantity = quantity;
    saveCart();
  }
  return cartState;
}

/**
 * Remove item from cart
 */
export async function removeItem(productId) {
  cartState.items = cartState.items.filter(i => i.productId !== productId);
  saveCart();
  return cartState;
}

/**
 * Clear entire cart
 */
export async function clearAll() {
  cartState = { items: [], total: 0, itemCount: 0 };
  localStorage.removeItem('qb_cart');
  notify();
  return cartState;
}
