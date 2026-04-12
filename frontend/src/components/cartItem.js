/**
 * Cart item row component
 */

import * as store from '../store.js';
import { showToast } from './toast.js';

export function createCartItem(item) {
  const row = document.createElement('div');
  row.className = 'cart-item';
  row.id = `cart-item-${item.productId}`;

  row.innerHTML = `
    <span class="cart-item-emoji">${item.product.image}</span>
    <div class="cart-item-info">
      <div class="cart-item-name">${item.product.name}</div>
      <div class="cart-item-price">₹${item.product.price.toFixed(2)} / ${item.product.unit}</div>
    </div>
    <div class="cart-item-controls">
      <button class="qty-btn" id="qty-minus-${item.productId}">−</button>
      <span class="cart-item-qty">${item.quantity}</span>
      <button class="qty-btn" id="qty-plus-${item.productId}">+</button>
    </div>
    <span class="cart-item-subtotal">₹${item.subtotal.toFixed(2)}</span>
    <button class="cart-item-remove" id="remove-${item.productId}" title="Remove item">✕</button>
  `;

  // Decrease quantity
  row.querySelector(`#qty-minus-${item.productId}`).addEventListener('click', async () => {
    try {
      if (item.quantity <= 1) {
        await store.removeItem(item.productId);
        showToast(`${item.product.name} removed from cart`, 'info');
      } else {
        await store.updateItem(item.productId, item.quantity - 1);
      }
      // Page will re-render via store subscription
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Increase quantity
  row.querySelector(`#qty-plus-${item.productId}`).addEventListener('click', async () => {
    try {
      await store.updateItem(item.productId, item.quantity + 1);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Remove item
  row.querySelector(`#remove-${item.productId}`).addEventListener('click', async () => {
    try {
      await store.removeItem(item.productId);
      showToast(`${item.product.name} removed from cart`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  return row;
}
