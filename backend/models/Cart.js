// In-memory cart storage
let cartItems = [];

/**
 * Get all cart items with computed totals
 */
function getCart() {
  const Product = require('./Product');
  const items = cartItems.map(item => {
    const product = Product.getById(item.productId);
    return {
      ...item,
      product,
      subtotal: product ? +(product.price * item.quantity).toFixed(2) : 0
    };
  }).filter(item => item.product !== null);

  const total = +items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, total, itemCount };
}

/**
 * Add an item to cart or increase quantity if already present
 */
function addItem(productId, quantity = 1) {
  const Product = require('./Product');
  const product = Product.getById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const existing = cartItems.find(item => item.productId === parseInt(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({ productId: parseInt(productId), quantity });
  }

  return getCart();
}

/**
 * Update quantity for a specific item
 */
function updateItem(productId, quantity) {
  const index = cartItems.findIndex(item => item.productId === parseInt(productId));
  if (index === -1) {
    throw new Error('Item not in cart');
  }

  if (quantity <= 0) {
    cartItems.splice(index, 1);
  } else {
    cartItems[index].quantity = quantity;
  }

  return getCart();
}

/**
 * Remove an item from cart
 */
function removeItem(productId) {
  const index = cartItems.findIndex(item => item.productId === parseInt(productId));
  if (index === -1) {
    throw new Error('Item not in cart');
  }

  cartItems.splice(index, 1);
  return getCart();
}

/**
 * Clear entire cart
 */
function clearCart() {
  cartItems = [];
  return getCart();
}

/**
 * Get current items (raw) for order creation
 */
function getRawItems() {
  return [...cartItems];
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, getRawItems };
