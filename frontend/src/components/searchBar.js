/**
 * Search bar component with debounce
 */

export function createSearchBar(currentValue, onSearch) {
  const container = document.createElement('div');
  container.className = 'search-container';

  container.innerHTML = `
    <span class="search-icon">🔍</span>
    <input
      type="text"
      class="search-input"
      id="search-input"
      placeholder="Search for groceries..."
      value="${currentValue || ''}"
      autocomplete="off"
    />
  `;

  const input = container.querySelector('input');
  let timeout;

  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onSearch(input.value.trim());
    }, 300); // 300ms debounce
  });

  // Clear on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      onSearch('');
    }
  });

  return container;
}
