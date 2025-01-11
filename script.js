// Initialize cards from localStorage
let cards = JSON.parse(localStorage.getItem('cards') || '[]');
let activeFilter = 'all';
let editingId = null;

// Card types configuration
const cardTypes = [
  'youtube', 'website', 'blog', 'facebook', 
  'twitter', 'instagram', 'linkedin', 'email', 'other'
];

// Get icon name for card type
function getIconName(type) {
  const iconMap = {
    website: 'globe',
    youtube: 'youtube',
    blog: 'rss',
    facebook: 'facebook',
    twitter: 'twitter',
    instagram: 'instagram',
    linkedin: 'linkedin',
    email: 'mail',
    other: 'link'
  };
  return iconMap[type] || 'link';
}

// Initialize filters
function initializeFilters() {
  const filtersContainer = document.getElementById('filters');
  cardTypes.forEach(type => {
    const button = document.createElement('button');
    button.className = 'filter-btn px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 flex items-center gap-2';
    button.setAttribute('data-type', type);
    button.onclick = () => filterCards(type);
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', getIconName(type));
    icon.className = 'w-5 h-5';
    
    const text = document.createElement('span');
    text.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    
    button.appendChild(icon);
    button.appendChild(text);
    filtersContainer.appendChild(button);
  });
  lucide.createIcons();
}

// Filter cards
function filterCards(type) {
  activeFilter = type;
  updateFilterButtons();
  renderCards();
}

// Update filter button styles
function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-type') === activeFilter;
    btn.className = `filter-btn px-4 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? 'nigtfilter-btn bg-blue-600 text-white'
        : 'bg-white text-gray-600 hover:bg-gray-100'
    }`;
  });
}

// Show form modal
function showForm() {
  document.getElementById('formModal').classList.remove('hidden');
}

// Hide form modal
function hideForm() {
  document.getElementById('formModal').classList.add('hidden');
  document.getElementById('cardForm').reset();
  document.getElementById('editId').value = '';
  editingId = null;
  document.getElementById('formTitle').textContent = 'Add New Card';
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  
  const formData = {
    id: editingId || crypto.randomUUID(),
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    link: document.getElementById('link').value,
    type: document.getElementById('type').value,
    image: document.getElementById('imageUrl').value,
    createdAt: editingId ? cards.find(c => c.id === editingId).createdAt : new Date().toISOString()
  };

  saveCard(formData);
}

// Save card data
function saveCard(formData) {
  if (editingId) {
    cards = cards.map(card => card.id === editingId ? formData : card);
  } else {
    cards.unshift(formData);
  }
  
  localStorage.setItem('cards', JSON.stringify(cards));
  hideForm();
  renderCards();
}

// Edit card
function editCard(id) {
  const card = cards.find(c => c.id === id);
  if (!card) return;

  editingId = id;
  document.getElementById('editId').value = id;
  document.getElementById('title').value = card.title;
  document.getElementById('description').value = card.description;
  document.getElementById('link').value = card.link;
  document.getElementById('type').value = card.type;
  document.getElementById('imageUrl').value = card.image || '';
  document.getElementById('formTitle').textContent = 'Edit Card';
  
  showForm();
}

// Delete card
function deleteCard(id) {
  if (confirm('Are you sure you want to delete this card?')) {
    cards = cards.filter(card => card.id !== id);
    localStorage.setItem('cards', JSON.stringify(cards));
    renderCards();
  }
}

// Render cards
function renderCards() {
  const container = document.getElementById('cards');
  const filteredCards = activeFilter === 'all' 
    ? cards 
    : cards.filter(card => card.type === activeFilter);

  if (filteredCards.length === 0) {
    container.innerHTML = ` 
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500">
          ${activeFilter === 'all' 
            ? "No cards yet. Click 'Add Card' to create one!"
            : `No ${activeFilter} cards found. Add some or try a different filter.`}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredCards.map(card => `
    <div class="night-card card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" data-id="${card.id}">
      ${card.image ? `
        <div class="aspect-video bg-gray-100">
          <img
            src="${card.image}"
            alt="${card.title}"
            class="w-full h-full object-cover"
            onerror="this.src='https://via.placeholder.com/400x225?text=No+Image'">
        </div>
      ` : ''}
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <i data-lucide="${getIconName(card.type)}" class="w-5 h-5"></i>
            <span class="text-sm font-medium text-gray-500 capitalize">
              ${card.type}
            </span>
          </div>
          <div class="flex gap-2">
            <!-- <button
              class="drag-handle p-1 text-gray-500 cursor-move hover:text-gray-700 transition-colors"
              title="Drag to reorder">
              <i data-lucide="move" class="w-5 h-5"></i>
            </button> -->
            <button
              onclick="editCard('${card.id}')"
              class="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <i data-lucide="edit" class="w-5 h-5"></i>
            </button>
            <button
              onclick="deleteCard('${card.id}')"
              class="p-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        <h3 class="header text-lg font-semibold text-gray-900 mb-2">
          ${card.title}
        </h3>
        ${card.description ? `
          <p class="sec-text text-gray-600 mb-4 line-clamp-2">${card.description}</p>
        ` : ''}
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">
            Added: ${new Date(card.createdAt).toLocaleDateString()}
          </span>
          <a
            href="${card.link}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Visit <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  initializeSortable();
}

// Initialize sortable functionality
function initializeSortable() {
  const container = document.getElementById('cards');

  Sortable.create(container, {
    animation: 150,
    handle: '.drag-handle', // Use the drag handle button
    onEnd: event => {
      const newOrder = Array.from(container.children).map(card => card.getAttribute('data-id'));
      cards = newOrder.map(id => cards.find(card => card.id === id));
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  });
}

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  initializeFilters();
  renderCards();
  lucide.createIcons();
});



// DAY & NIGHT MODE:
// Check and apply saved theme
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  updateThemeToggle();
});

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  updateThemeToggle();
}

// Update toggle button text and icon
function updateThemeToggle() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const themeIcon = document.getElementById('themeIcon');
  const themeToggle = document.getElementById('themeToggle');

  // Update the icon type and button styles
  themeIcon.setAttribute('data-lucide', isDarkMode ? 'moon' : 'sun');
  themeToggle.classList.toggle('bg-gray-200', !isDarkMode);
  themeToggle.classList.toggle('bg-gray-800', isDarkMode);
  themeToggle.classList.toggle('text-gray-800', !isDarkMode);
  themeToggle.classList.toggle('text-white', isDarkMode);

  // Re-render icons
  lucide.createIcons();
}
