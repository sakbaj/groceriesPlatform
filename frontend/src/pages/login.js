import { login } from '../api.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { fetchCart } from '../store.js';

export function renderLoginPage() {
  const mainEl = document.getElementById('app-main');
  
  mainEl.innerHTML = `
    <div class="checkout-page">
      <h1 class="page-title">🔐 Login</h1>
      <form id="login-form" class="checkout-form">
        <div class="form-group">
          <label class="form-label" for="login-email">Email</label>
          <input type="email" id="login-email" class="form-input" placeholder="you@example.com" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="login-password">Password</label>
          <input type="password" id="login-password" class="form-input" placeholder="Your password" required />
        </div>
        <button type="submit" class="btn-place-order">Sign In →</button>
        <p style="text-align:center;color:var(--text-secondary);margin-top:var(--space-sm);">
          Don't have an account? <a href="#/signup" style="color:var(--accent);">Sign up</a>
        </p>
      </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Signing in…';
    btn.disabled = true;
    try {
      await login(email, password);
      showToast('Logged in successfully!');
      await fetchCart(); // load user's cart
      navigateTo('/');
    } catch (err) {
      showToast(err.message, 'error');
      btn.textContent = 'Sign In →';
      btn.disabled = false;
    }
  });
}
