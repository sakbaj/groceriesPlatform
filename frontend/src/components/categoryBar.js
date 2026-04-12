/**
 * Category filter bar component
 */

export function createCategoryBar(categories, activeCategory, onSelect) {
  const bar = document.createElement('div');
  bar.className = 'category-bar';

  // "All" pill
  const allPill = document.createElement('button');
  allPill.className = `category-pill ${!activeCategory ? 'active' : ''}`;
  allPill.textContent = '🏪 All';
  allPill.id = 'category-all';
  allPill.addEventListener('click', () => onSelect(null));
  bar.appendChild(allPill);

  const categoryIcons = {
    'Fruits': '🍎',
    'Vegetables': '🥦',
    'Dairy': '🥛',
    'Bakery': '🍞',
    'Beverages': '☕',
    'Snacks': '🍿'
  };

  categories.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = `category-pill ${activeCategory === cat ? 'active' : ''}`;
    pill.textContent = `${categoryIcons[cat] || '📦'} ${cat}`;
    pill.id = `category-${cat.toLowerCase()}`;
    pill.addEventListener('click', () => onSelect(cat));
    bar.appendChild(pill);
  });

  return bar;
}
