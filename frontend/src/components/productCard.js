/**
 * Product Card component
 */

import * as store from '../store.js';
import { showToast } from './toast.js';

export function createProductCard(product, index = 0) {
  const card = document.createElement('div');
  card.className = 'product-card stagger-in';
  card.style.animationDelay = `${index * 0.05}s`;

  card.innerHTML = `
    <div class="product-emoji">${product.image}</div>
    <div class="product-category">${product.category}</div>
    <h3 class="product-name">${product.name}</h3>
    <p class="product-description">${product.description}</p>
    <div class="product-meta">
      <div>
        <span class="product-price">₹${product.price.toFixed(2)}</span>
        <span class="product-unit">/ ${product.unit}</span>
      </div>
      <div class="product-rating">
        ⭐ ${product.rating}
      </div>
    </div>
    <button class="btn-add-cart" id="add-to-cart-${product.id}">
      <span>🛒</span> Add to Cart
    </button>
  `;

  const btn = card.querySelector('.btn-add-cart');
  btn.addEventListener('click', async () => {
    try {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> Adding...';
      await store.addItem(product.id);
      btn.innerHTML = '<span>✓</span> Added!';
      btn.classList.add('added');
      showToast(`${product.name} added to cart`, 'success');

      setTimeout(() => {
        btn.innerHTML = '<span>🛒</span> Add to Cart';
        btn.classList.remove('added');
        btn.disabled = false;
      }, 1500);
    } catch (err) {
      btn.innerHTML = '<span>🛒</span> Add to Cart';
      btn.disabled = false;
      showToast(err.message, 'error');
    }
  });

  return card;
}
