/**
 * In-memory data store — replaces MongoDB/Mongoose.
 * All data lives in plain JS arrays and is lost on restart.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─── helpers ───────────────────────────────────────────────
function uid() {
  return crypto.randomBytes(12).toString('hex');
}

function matchesQuery(item, query) {
  for (const [key, value] of Object.entries(query)) {
    if (key === '$or') {
      const matched = value.some(sub => matchesQuery(item, sub));
      if (!matched) return false;
      continue;
    }
    if (value instanceof RegExp) {
      if (!value.test(item[key])) return false;
    } else {
      if (item[key] !== value) return false;
    }
  }
  return true;
}

// ─── collections ───────────────────────────────────────────
const collections = {
  users: [],
  products: [],
  carts: [],
  orders: [],
};

// ─── Product helpers ───────────────────────────────────────
const Product = {
  find(query = {}) {
    return collections.products.filter(p => matchesQuery(p, query));
  },
  findOne(query = {}) {
    return collections.products.find(p => matchesQuery(p, query)) || null;
  },
  distinct(field) {
    const set = new Set(collections.products.map(p => p[field]).filter(Boolean));
    return [...set];
  },
  countDocuments() {
    return collections.products.length;
  },
  insertMany(docs) {
    const now = new Date().toISOString();
    for (const doc of docs) {
      collections.products.push({ ...doc, _id: uid(), createdAt: now, updatedAt: now });
    }
  },
};

// ─── User helpers ──────────────────────────────────────────
const User = {
  findOne(query = {}) {
    return collections.users.find(u => matchesQuery(u, query)) || null;
  },
  findById(id) {
    return collections.users.find(u => u._id === id) || null;
  },
  create(data) {
    const now = new Date().toISOString();
    const user = { _id: uid(), ...data, createdAt: now, updatedAt: now };
    // expose .id alias
    user.id = user._id;
    collections.users.push(user);
    return user;
  },
};

// ─── Cart helpers ──────────────────────────────────────────
const Cart = {
  findOne(query = {}) {
    return collections.carts.find(c => matchesQuery(c, query)) || null;
  },
  create(data) {
    const now = new Date().toISOString();
    const cart = { _id: uid(), ...data, items: data.items || [], createdAt: now, updatedAt: now };
    collections.carts.push(cart);
    return cart;
  },
  /** persist changes — no-op for in-memory but keeps route code untouched */
  save(cart) {
    // already mutated in-place
  },
};

// ─── Order helpers ─────────────────────────────────────────
const Order = {
  find(query = {}) {
    let results = collections.orders.filter(o => matchesQuery(o, query));
    // Return a chain-able object with .sort()
    return {
      _data: results,
      sort(sortObj) {
        if (sortObj && sortObj.createdAt === -1) {
          this._data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return this._data;
      },
      // if .sort() is not called, allow iteration
      [Symbol.iterator]() { return this._data[Symbol.iterator](); },
      get length() { return this._data.length; },
      reduce(...args) { return this._data.reduce(...args); },
      forEach(...args) { return this._data.forEach(...args); },
      then(cb) { return cb(this._data); },
    };
  },
  findOne(query = {}) {
    return collections.orders.find(o => matchesQuery(o, query)) || null;
  },
  create(data) {
    const now = new Date().toISOString();
    const order = { _id: uid(), ...data, createdAt: now, updatedAt: now };
    collections.orders.push(order);
    return order;
  },
};

// ─── Seed ──────────────────────────────────────────────────
function seedProducts() {
  if (collections.products.length > 0) return;
  const dataPath = path.join(__dirname, '..', 'data', 'products.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const products = JSON.parse(raw);
  Product.insertMany(products);
  console.log('In-memory store seeded with products.json');
}

module.exports = { Product, User, Cart, Order, seedProducts };
