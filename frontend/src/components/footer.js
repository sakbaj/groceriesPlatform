/**
 * Footer component
 */

export function renderFooter() {
  const footerEl = document.getElementById('app-footer');
  
  footerEl.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="footer-logo-icon">🛒</span>
          <span class="footer-logo-text">Quickbasket</span>
        </div>
        <p class="footer-tagline">Fresh Groceries, Delivered to You</p>
      </div>
      
      <div class="footer-policy">
        <h3>💚 Our Keep-It-Fresh Promise & Refund Policy</h3>
        <p>We want you to be 100% happy with your groceries. If anything you receive isn't perfectly fresh, or if you're unhappy with the quality, just contact us within 24 hours of delivery. We will gladly offer a no-questions-asked replacement or a full refund for that item. No stress, no hassle — just good food!</p>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Quickbasket. All rights reserved.</p>
        <p class="footer-love">Made with 💚 to keep you healthy.</p>
      </div>
    </div>
  `;
}
