import { getOrders, getUser } from '../api.js';
import { navigateTo } from '../router.js';

export async function renderOrdersPage() {
  const mainEl = document.getElementById('app-main');
  
  if (!getUser()) {
    navigateTo('/login');
    return;
  }

  mainEl.innerHTML = `<div style="text-align: center; padding: 4rem;">Loading orders...</div>`;

  try {
    const res = await getOrders();
    const orders = res.data || [];

    if (orders.length === 0) {
      mainEl.innerHTML = `
        <div class="dashboard-container fade-in">
          <h2 class="dashboard-title">Order History</h2>
          <div class="cart-empty">
            <div class="cart-empty-icon">📦</div>
            <p class="cart-empty-text">You haven't placed any orders yet.</p>
            <a href="#/" class="btn-shop-now" style="text-decoration: none;">Start Shopping</a>
          </div>
        </div>
      `;
      return;
    }

    const ordersHtml = orders.map(order => `
      <div class="order-history-card">
        <div class="order-history-header">
          <div>
            <h3 class="order-id">Order #${order._id.slice(-6).toUpperCase()}</h3>
            <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="order-summary-price">
            <div class="order-total-amount">₹${order.total.toFixed(2)}</div>
            <span class="order-status-badge">${order.status}</span>
          </div>
        </div>
        <div class="order-items-grid">
          ${order.items.map(item => {
            const price = item.price ?? item.product?.price ?? (item.subtotal / item.quantity) ?? 0;
            return `
              <div class="order-item-line">
                <div class="order-item-thumbnail">${item.image || '📦'}</div>
                <div class="order-item-desc">
                  <div class="order-item-title">${item.name}</div>
                  <div class="order-item-qty-price">Qty: ${item.quantity} x ₹${price.toFixed(2)}</div>
                </div>
                <div class="order-item-line-subtotal">₹${item.subtotal.toFixed(2)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    mainEl.innerHTML = `
      <div class="dashboard-container fade-in">
        <h2 class="dashboard-title">Order History</h2>
        ${ordersHtml}
      </div>
    `;

  } catch (error) {
    mainEl.innerHTML = `<div style="text-align: center; padding: 4rem; color: #ef4444;">Error loading orders: ${error.message}</div>`;
  }
}
