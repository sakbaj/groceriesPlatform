import { register } from '../api.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { fetchCart } from '../store.js';

export function renderSignupPage() {
  const mainEl = document.getElementById('app-main');
  
  mainEl.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="auth-icon">✨</div>
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join us for fresh groceries every day</p>
        </div>
        
        <form id="signup-form" class="auth-form">
          <div class="auth-input-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <div style="position: relative;">
              <input type="text" id="signup-name" class="auth-input" placeholder="John Doe" required style="width: 100%; padding-left: 2.75rem;" />
              <span class="auth-input-icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">👤</span>
            </div>
          </div>
          
          <div class="auth-input-group">
            <label class="form-label" for="signup-email">Email Address</label>
            <div style="position: relative;">
              <input type="email" id="signup-email" class="auth-input" placeholder="you@example.com" required style="width: 100%; padding-left: 2.75rem;" />
              <span class="auth-input-icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">✉️</span>
            </div>
          </div>
          
          <div class="auth-input-group">
            <label class="form-label" for="signup-password">Password</label>
            <div style="position: relative;">
              <input type="password" id="signup-password" class="auth-input" placeholder="Min. 6 characters" required minlength="6" style="width: 100%; padding-left: 2.75rem;" />
              <span class="auth-input-icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔑</span>
            </div>
          </div>
          
          <button type="submit" class="auth-btn">
            <span>Create Account</span>
            <span>→</span>
          </button>
        </form>
        
        <div class="auth-footer">
          Already have an account? <a href="#/login" class="auth-link">Sign in</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span style="animation: float 1s infinite;">⏳</span> Creating...`;
    btn.disabled = true;

    try {
      await register(name, email, password);
      showToast('Account created successfully!');
      await fetchCart();
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
