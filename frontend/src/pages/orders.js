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
        <div style="max-width: 800px; margin: 2rem auto; padding: 1rem;">
          <h2 style="margin-bottom: 1rem;">Order History</h2>
          <div style="background: var(--surface); padding: 3rem; text-align: center; border-radius: 1rem; border: 1px solid var(--border);">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">You haven't placed any orders yet.</p>
            <a href="#/" class="checkout-btn" style="display: inline-block; text-decoration: none;">Start Shopping</a>
          </div>
        </div>
      `;
      return;
    }

    const ordersHtml = orders.map(order => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
          <div>
            <h3 style="margin-bottom: 0.25rem;">Order #${order._id.slice(-6).toUpperCase()}</h3>
            <span style="color: var(--text-secondary); font-size: 0.875rem;">${new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 600; font-size: 1.25rem; color: var(--accent);">$${order.total.toFixed(2)}</div>
            <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 0.25rem 0.5rem; border-radius: 1rem; font-size: 0.75rem; text-transform: uppercase;">${order.status}</span>
          </div>
        </div>
        <div style="display: grid; gap: 1rem;">
          ${order.items.map(item => `
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 0.5rem;" />
              <div style="flex: 1;">
                <div style="font-weight: 500;">${item.name}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Qty: ${item.quantity} x $${item.price}</div>
              </div>
              <div style="font-weight: 500;">$${item.subtotal.toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    mainEl.innerHTML = `
      <div style="max-width: 800px; margin: 2rem auto; padding: 1rem;">
        <h2 style="margin-bottom: 2rem;">Order History</h2>
        ${ordersHtml}
      </div>
    `;

  } catch (error) {
    mainEl.innerHTML = `<div style="text-align: center; padding: 4rem; color: #ef4444;">Error loading orders: ${error.message}</div>`;
  }
}
