import { getAnalytics, getUser } from '../api.js';
import { navigateTo } from '../router.js';

export async function renderAnalyticsPage() {
  const mainEl = document.getElementById('app-main');
  
  if (!getUser()) {
    navigateTo('/login');
    return;
  }

  mainEl.innerHTML = `<div style="text-align: center; padding: 4rem;">Loading analytics...</div>`;

  try {
    const res = await getAnalytics();
    const data = res.data;

    mainEl.innerHTML = `
      <div class="dashboard-container fade-in">
        <h2 class="dashboard-title">Platform Analytics Dashboard</h2>
        
        <div class="analytics-stats-grid">
          <div class="analytics-stat-card">
            <div class="analytics-stat-label">Total Orders</div>
            <div class="analytics-stat-value">${data.totalOrders}</div>
          </div>
          <div class="analytics-stat-card">
            <div class="analytics-stat-label">Total Revenue</div>
            <div class="analytics-stat-value">₹${data.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <h3 style="margin-bottom: 1.5rem; font-weight: 700;">Most Popular Items</h3>
        <div class="popular-items-card">
          ${data.popularItems.map((item, index) => `
            <div class="popular-item-row">
              <div class="popular-item-info">${index + 1}. ${item.name}</div>
              <div class="popular-item-stats">${item.count} units sold</div>
            </div>
          `).join('')}
          ${data.popularItems.length === 0 ? '<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No sales data available yet.</div>' : ''}
        </div>
      </div>
    `;

  } catch (error) {
    mainEl.innerHTML = `<div style="text-align: center; padding: 4rem; color: #ef4444;">Error loading analytics: ${error.message}</div>`;
  }
}
