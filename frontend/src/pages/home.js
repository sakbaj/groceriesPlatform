/**
 * Home Page — Product listing with category filters and search
 */

import * as api from '../api.js';
import { createProductCard } from '../components/productCard.js';
import { createCategoryBar } from '../components/categoryBar.js';
import { createSearchBar } from '../components/searchBar.js';
import { renderHeader } from '../components/header.js';

let currentCategory = null;
let currentSearch = '';
let categories = [];

export async function renderHomePage() {
  renderHeader();
  const main = document.getElementById('app-main');

  // Fetch categories if we don't have them
  if (categories.length === 0) {
    try {
      const catRes = await api.getCategories();
      categories = catRes.data;
    } catch (err) {
      categories = [];
    }
  }

  // Build page structure
  main.innerHTML = '';

  // Hero
  const hero = document.createElement('section');
  hero.className = 'hero fade-in';
  hero.innerHTML = `
    <h1 class="hero-title">
      Fresh Groceries,<br />
      <span class="hero-title-accent">Delivered to You</span>
    </h1>
    <p class="hero-subtitle">
      Browse our curated selection of premium fruits, vegetables, dairy, bakery items, beverages, and snacks.
    </p>
  `;
  main.appendChild(hero);

  // Search
  const searchBar = createSearchBar(currentSearch, (query) => {
    currentSearch = query;
    loadProducts();
  });
  main.appendChild(searchBar);

  // Categories
  const categoryBar = createCategoryBar(categories, currentCategory, (cat) => {
    currentCategory = cat;
    loadProducts();
    // Re-render category bar to update active state
    const newCategoryBar = createCategoryBar(categories, currentCategory, arguments.callee === undefined ? () => {} : (c) => {
      currentCategory = c;
      loadProducts();
      renderCategoryBarInPlace();
    });
    const existingBar = main.querySelector('.category-bar');
    if (existingBar) {
      existingBar.replaceWith(createCategoryBar(categories, currentCategory, handleCategorySelect));
    }
  });
  main.appendChild(categoryBar);

  // Product count
  const countEl = document.createElement('p');
  countEl.className = 'product-count';
  countEl.id = 'product-count';
  main.appendChild(countEl);

  // Product grid
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  grid.id = 'product-grid';
  main.appendChild(grid);

  // Load products
  await loadProducts();
}

function handleCategorySelect(cat) {
  currentCategory = cat;
  loadProducts();
  // Update category bar active state
  const main = document.getElementById('app-main');
  const oldBar = main.querySelector('.category-bar');
  if (oldBar) {
    const newBar = createCategoryBar(categories, currentCategory, handleCategorySelect);
    oldBar.replaceWith(newBar);
  }
}

function renderCategoryBarInPlace() {
  const main = document.getElementById('app-main');
  const oldBar = main.querySelector('.category-bar');
  if (oldBar) {
    const newBar = createCategoryBar(categories, currentCategory, handleCategorySelect);
    oldBar.replaceWith(newBar);
  }
}

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('product-count');

  if (!grid) return;

  try {
    const res = await api.getProducts({
      category: currentCategory,
      search: currentSearch
    });

    const products = res.data;
    countEl.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}${currentCategory ? ` in ${currentCategory}` : ''}${currentSearch ? ` matching "${currentSearch}"` : ''}`;

    grid.innerHTML = '';

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <p style="color: var(--text-secondary);">No products found. Try a different search or category.</p>
        </div>
      `;
      return;
    }

    products.forEach((product, index) => {
      grid.appendChild(createProductCard(product, index));
    });
  } catch (err) {
    grid.innerHTML = `<p style="color: var(--red); grid-column: 1/-1; text-align: center;">Failed to load products: ${err.message}</p>`;
  }

  // Update category bar
  renderCategoryBarInPlace();
}
