const fs = require('fs');
const path = require('path');

let products = [];

// Load products from JSON seed data
function loadProducts() {
  const dataPath = path.join(__dirname, '..', 'data', 'products.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  products = JSON.parse(raw);
}

// Initialize on first require
loadProducts();

/**
 * Get all products, optionally filtered by category and search query
 */
function getAll({ category, search } = {}) {
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  return result;
}

/**
 * Get a single product by ID
 */
function getById(id) {
  return products.find(p => p.id === parseInt(id)) || null;
}

/**
 * Get all unique categories
 */
function getCategories() {
  const cats = [...new Set(products.map(p => p.category))];
  return cats.sort();
}

module.exports = { getAll, getById, getCategories };
