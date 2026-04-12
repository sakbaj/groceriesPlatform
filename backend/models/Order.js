const Product = require('./Product');

// In-memory order storage
let orders = [];
let nextOrderId = 1;

/**
 * Create an order from current cart contents
 */
function createOrder(cartItems, total, customerInfo) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cannot create order with empty cart');
  }

  const { customerName, address, phone } = customerInfo;

  if (!customerName || !address || !phone) {
    throw new Error('Customer name, address, and phone are required');
  }

  const orderItems = cartItems.map(item => {
    const product = Product.getById(item.productId);
    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      quantity: item.quantity,
      subtotal: +(product.price * item.quantity).toFixed(2)
    };
  });

  const order = {
    id: nextOrderId++,
    items: orderItems,
    total,
    customerName,
    address,
    phone,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  return order;
}

/**
 * Get all orders
 */
function getAll() {
  return [...orders].reverse(); // newest first
}

/**
 * Get a single order by ID
 */
function getById(id) {
  return orders.find(o => o.id === parseInt(id)) || null;
}

module.exports = { createOrder, getAll, getById };
