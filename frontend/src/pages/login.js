import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { fetchCart } from '../store.js';

export function renderLoginPage() {
  const mainEl = document.getElementById('app-main');
  
  mainEl.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="auth-icon">🔐</div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to access your fresh groceries</p>
        </div>
        
        <form id="login-form" class="auth-form">
          <div class="auth-input-group">
            <label class="form-label" for="login-email">Email Address</label>
            <div style="position: relative;">
              <input type="email" id="login-email" class="auth-input" placeholder="you@example.com" required style="width: 100%; padding-left: 2.75rem;" />
              <span class="auth-input-icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">✉️</span>
            </div>
          </div>
          
          <div class="auth-input-group">
            <label class="form-label" for="login-password">Password</label>
            <div style="position: relative;">
              <input type="password" id="login-password" class="auth-input" placeholder="Your password" required style="width: 100%; padding-left: 2.75rem;" />
              <span class="auth-input-icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔑</span>
            </div>
          </div>
          
          <button type="submit" class="auth-btn">
            <span>Sign In</span>
            <span>→</span>
          </button>
        </form>
        
        <div class="auth-footer">
          Don't have an account? <a href="#/signup" class="auth-link">Sign up</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span style="animation: float 1s infinite;">⏳</span> Signing in...`;
    btn.disabled = true;

    try {
      // Mock Authentication
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      await new Promise(r => setTimeout(r, 800)); // Simulate delay
      
      const mockUser = {
        _id: 'mock_user_' + Math.floor(Math.random() * 10000),
        name: email.split('@')[0],
        email: email,
        token: 'mock_jwt_token_12345'
      };
      
      localStorage.setItem('qb_token', mockUser.token);
      localStorage.setItem('qb_user', JSON.stringify(mockUser));
      
      showToast('Logged in successfully!');
      await fetchCart(); // load local cart
      navigateTo('/');
    } catch (err) {
      showToast(err.message, 'error');
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      const container = document.querySelector('.auth-container');
      container.style.animation = 'none';
      container.offsetHeight;
      container.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    }
  });
}
