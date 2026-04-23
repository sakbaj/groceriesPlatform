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
      <div style="max-width: 1000px; margin: 2rem auto; padding: 1rem;">
        <h2 style="margin-bottom: 2rem;">Platform Analytics Dashboard</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
          <div style="background: var(--surface); padding: 2rem; border-radius: 1rem; border: 1px solid var(--border); text-align: center;">
            <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Total Orders</div>
            <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">${data.totalOrders}</div>
          </div>
          <div style="background: var(--surface); padding: 2rem; border-radius: 1rem; border: 1px solid var(--border); text-align: center;">
            <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Total Revenue</div>
            <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">$${data.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <h3 style="margin-bottom: 1rem;">Most Popular Items</h3>
        <div style="background: var(--surface); border-radius: 1rem; border: 1px solid var(--border); overflow: hidden;">
          ${data.popularItems.map((item, index) => `
            <div style="display: flex; justify-content: space-between; padding: 1.5rem; border-bottom: ${index < data.popularItems.length - 1 ? '1px solid var(--border)' : 'none'};">
              <div style="font-weight: 500;">${index + 1}. ${item.name}</div>
              <div style="color: var(--accent); font-weight: 600;">${item.count} units sold</div>
            </div>
          `).join('')}
          ${data.popularItems.length === 0 ? '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No sales data available yet.</div>' : ''}
        </div>
      </div>
    `;

  } catch (error) {
    mainEl.innerHTML = `<div style="text-align: center; padding: 4rem; color: #ef4444;">Error loading analytics: ${error.message}</div>`;
  }
}
