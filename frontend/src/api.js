/**
 * Quickbasket API Client
 * Handles all communication with the backend server
 */

const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ---- Products ----

export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return request(`/products${qs ? '?' + qs : ''}`);
}

export async function getProduct(id) {
  return request(`/products/${id}`);
}

export async function getCategories() {
  return request('/categories');
}

// ---- Cart ----

export async function getCart() {
  return request('/cart');
}

export async function addToCart(productId, quantity = 1) {
  return request('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });
}

export async function updateCartItem(productId, quantity) {
  return request(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}

export async function removeFromCart(productId) {
  return request(`/cart/${productId}`, {
    method: 'DELETE'
  });
}

export async function clearCart() {
  return request('/cart', { method: 'DELETE' });
}

// ---- Orders ----

export async function placeOrder(customerInfo) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(customerInfo)
  });
}

export async function getOrders() {
  return request('/orders');
}

export async function getOrder(id) {
  return request(`/orders/${id}`);
}
