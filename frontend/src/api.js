/**
 * Quickbasket API Client
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('qb_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ---- Auth ----

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Login failed');
  localStorage.setItem('qb_token', data.data.token);
  localStorage.setItem('qb_user', JSON.stringify(data.data));
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Registration failed');
  localStorage.setItem('qb_token', data.data.token);
  localStorage.setItem('qb_user', JSON.stringify(data.data));
  return data;
}

export function logout() {
  localStorage.removeItem('qb_token');
  localStorage.removeItem('qb_user');
  window.location.hash = '#/login';
}

export function getUser() {
  const u = localStorage.getItem('qb_user');
  return u ? JSON.parse(u) : null;
}

// ---- Products ----

export async function getProducts(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  const q = new URLSearchParams(cleanParams).toString();
  const res = await fetch(`${API_BASE}/products${q ? '?' + q : ''}`);
  return await res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return await res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  return await res.json();
}

// ---- Cart ----

export async function getCart() {
  const res = await fetch(`${API_BASE}/cart`, { headers: getHeaders() });
  return await res.json();
}

export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ productId, quantity })
  });
  return await res.json();
}

export async function updateCartItem(productId, quantity) {
  const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ quantity })
  });
  return await res.json();
}

export async function removeFromCart(productId) {
  const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
}

// ---- Orders ----

export async function placeOrder(customerInfo) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(customerInfo)
  });
  return await res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
  return await res.json();
}

export async function getOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { headers: getHeaders() });
  return await res.json();
}

// ---- Analytics ----

export async function getAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`, { headers: getHeaders() });
  return await res.json();
}
