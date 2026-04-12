/**
 * Checkout Page — Order form and confirmation
 */

import * as store from '../store.js';
import * as api from '../api.js';
import { renderHeader } from '../components/header.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';

export async function renderCheckoutPage() {
  renderHeader();
  await store.fetchCart();

  const main = document.getElementById('app-main');
  const cart = store.getState();

  if (cart.items.length === 0) {
    main.innerHTML = `
      <div class="checkout-page fade-in">
        <h1 class="page-title">📋 Checkout</h1>
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p class="cart-empty-text">Your cart is empty</p>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">
            Add items to your cart before checking out
          </p>
          <button class="btn-shop-now" id="btn-shop-now">🏪 Start Shopping</button>
        </div>
      </div>
    `;
    document.getElementById('btn-shop-now')?.addEventListener('click', () => navigate('/'));
    return;
  }

  main.innerHTML = `
    <div class="checkout-page fade-in">
      <h1 class="page-title">📋 Checkout</h1>

      <div class="checkout-order-summary">
        <h3>Order Summary</h3>
        ${cart.items.map(item => `
          <div class="checkout-item-row">
            <span>${item.product.image} ${item.product.name} × ${item.quantity}</span>
            <span>₹${item.subtotal.toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="checkout-total-row">
          <span>Total</span>
          <span class="checkout-total-value">₹${cart.total.toFixed(2)}</span>
        </div>
      </div>

      <form class="checkout-form" id="checkout-form">
        <div class="form-group">
          <label class="form-label" for="customer-name">Full Name</label>
          <input class="form-input" type="text" id="customer-name" placeholder="Enter your full name" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="customer-phone">Phone Number</label>
          <input class="form-input" type="tel" id="customer-phone" placeholder="Enter your phone number" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="customer-address">Delivery Address</label>
          <textarea class="form-input" id="customer-address" placeholder="Enter your full delivery address" required></textarea>
        </div>

        <div class="checkout-payment-section">
          <h3>Payment Method</h3>
          
          <div class="payment-tabs">
            <label class="payment-tab active">
              <input type="radio" name="payment-method" value="upi" checked />
              <span class="payment-tab-icon">📱</span> UPI
            </label>
            <label class="payment-tab">
              <input type="radio" name="payment-method" value="card" />
              <span class="payment-tab-icon">💳</span> Credit / Debit Card
            </label>
            <label class="payment-tab">
              <input type="radio" name="payment-method" value="netbanking" />
              <span class="payment-tab-icon">🏦</span> Net Banking
            </label>
          </div>

          <div class="payment-details active" id="payment-upi">
            <div class="form-group">
              <label class="form-label" for="upi-id">UPI ID (e.g. user@okbank)</label>
              <input class="form-input" type="text" id="upi-id" placeholder="Enter your UPI ID" />
            </div>
          </div>

          <div class="payment-details" id="payment-card">
            <div class="form-group">
              <label class="form-label" for="card-number">Card Number</label>
              <input class="form-input" type="text" id="card-number" placeholder="XXXX XXXX XXXX XXXX" maxlength="19" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label" for="card-expiry">Expiry</label>
                <input class="form-input" type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" />
              </div>
              <div class="form-group">
                <label class="form-label" for="card-cvv">CVV</label>
                <input class="form-input" type="password" id="card-cvv" placeholder="123" maxlength="3" />
              </div>
            </div>
          </div>

          <div class="payment-details" id="payment-netbanking">
            <div class="form-group">
              <label class="form-label" for="bank-select">Select Bank</label>
              <select class="form-input" id="bank-select">
                <option value="">Choose your bank...</option>
                <option value="sbi">State Bank of India (SBI)</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-place-order" id="btn-place-order">
          🛍️ Place Order — ₹${cart.total.toFixed(2)}
        </button>

        <button type="button" class="btn-clear-cart" id="btn-back-to-cart" style="margin-top: 0.5rem;">
          ← Back to Cart
        </button>
      </form>
    </div>
  `;

  // Back to cart
  document.getElementById('btn-back-to-cart')?.addEventListener('click', () => {
    navigate('/cart');
  });

  // Handle payment method toggles
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      // Update active tab styles
      document.querySelectorAll('.payment-tab').forEach(tab => tab.classList.remove('active'));
      e.target.closest('.payment-tab').classList.add('active');

      // Show hide forms
      document.querySelectorAll('.payment-details').forEach(el => el.classList.remove('active'));
      document.getElementById(`payment-${e.target.value}`).classList.add('active');
    });
  });

  // Handle form submission
  document.getElementById('checkout-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('btn-place-order');
    const customerName = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Mock Payment Validation
    if (paymentMethod === 'upi' && !document.getElementById('upi-id').value.trim()) {
      showToast('Please enter your UPI ID', 'error'); return;
    }
    if (paymentMethod === 'card') {
      if (!document.getElementById('card-number').value.trim() || 
          !document.getElementById('card-expiry').value.trim() || 
          !document.getElementById('card-cvv').value.trim()) {
        showToast('Please enter complete card details', 'error'); return;
      }
    }
    if (paymentMethod === 'netbanking' && !document.getElementById('bank-select').value) {
      showToast('Please select a bank', 'error'); return;
    }

    if (!customerName || !phone || !address) {
      showToast('Please fill in all delivery details', 'error');
      return;
    }

    try {
      btn.disabled = true;
      btn.innerHTML = '⏳ Processing...';

      const res = await api.placeOrder({ customerName, phone, address });
      const order = res.data;

      // Cart is cleared on server, update local state
      await store.fetchCart();

      // Show order confirmation
      showOrderConfirmation(main, order);
      showToast('Order placed successfully! 🎉', 'success');
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = `🛍️ Place Order — ₹${cart.total.toFixed(2)}`;
      showToast(`Order failed: ${err.message}`, 'error');
    }
  });
}

function showOrderConfirmation(main, order) {
  renderHeader();

  main.innerHTML = `
    <div class="order-confirmation">
      <div class="order-success-icon">🎉</div>
      <h2 class="order-success-title">Order Confirmed!</h2>
      <p class="order-success-id">Order #${order.id} • ${new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div class="order-details-card">
        <div class="order-detail-row">
          <span class="order-detail-label">Customer</span>
          <span class="order-detail-value">${order.customerName}</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Phone</span>
          <span class="order-detail-value">${order.phone}</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Address</span>
          <span class="order-detail-value">${order.address}</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Payment Status</span>
          <span class="order-detail-value" style="color: var(--accent);">✓ Paid</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Order Status</span>
          <span class="order-detail-value" style="color: var(--accent);">✓ ${order.status}</span>
        </div>
        <div class="order-detail-row" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-glass);">
          <span class="order-detail-label">Items</span>
          <span class="order-detail-value">${order.items.length} item${order.items.length !== 1 ? 's' : ''}</span>
        </div>
        ${order.items.map(item => `
          <div class="order-detail-row" style="font-size: 0.8rem;">
            <span class="order-detail-label">${item.image} ${item.name} × ${item.quantity}</span>
            <span class="order-detail-value">₹${item.subtotal.toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="order-detail-row" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-glass); font-size: 1.1rem; font-weight: 700;">
          <span>Total</span>
          <span style="color: var(--accent);">₹${order.total.toFixed(2)}</span>
        </div>
      </div>

      <button class="btn-continue-shopping" id="btn-continue-shopping">
        🏪 Continue Shopping
      </button>
    </div>
  `;

  document.getElementById('btn-continue-shopping')?.addEventListener('click', () => {
    navigate('/');
  });
}
