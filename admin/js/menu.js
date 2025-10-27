class MenuManager {
    constructor() {
        this.menuItems = [];
        this.categories = [];
        this.filteredMenuItems = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addMenuItemBtn').addEventListener('click', () => {
            this.openMenuItemModal();
        });

        document.getElementById('menuItemForm').addEventListener('submit', (e) => {
            this.handleMenuItemSubmit(e);
        });

        // Filter event listeners
        const categoryFilter = document.getElementById('categoryFilter');
        const menuSearch = document.getElementById('menuSearch');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterMenuItems();
            });
        }

        if (menuSearch) {
            menuSearch.addEventListener('input', () => {
                this.filterMenuItems();
            });
        }
    }

    async loadMenuItems() {
        try {
            console.log('Laddar menyrätter...');
            this.menuItems = await api.getAllMenuItems();
            console.log('Menyrätter laddade:', this.menuItems);
            await this.loadCategories();
            this.filteredMenuItems = [...this.menuItems];
            this.updateMenuItemsDisplay();
        } catch (error) {
            console.error('Fel vid laddning av menyrätter:', error);
            showNotification(`Kunde inte ladda menyrätter: ${error.message}`, 'error');
        }
    }

    async loadCategories() {
        try {
            console.log('Laddar kategorier...');
            this.categories = await api.getCategories();
            console.log('Kategorier laddade:', this.categories);
            this.updateCategoryDropdowns();
        } catch (error) {
            console.error('Fel vid laddning av kategorier:', error);
            showNotification(`Kunde inte ladda kategorier: ${error.message}`, 'error');
        }
    }

    updateCategoryDropdowns() {
        // Uppdatera formulär-dropdown
        const formSelect = document.getElementById('itemCategory');
        if (formSelect) {
            formSelect.innerHTML = '<option value="">Välj kategori</option>';
            this.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                formSelect.appendChild(option);
            });
        }

        // Uppdatera filter-dropdown
        const filterSelect = document.getElementById('categoryFilter');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">Alla kategorier</option>';
            this.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                filterSelect.appendChild(option);
            });
        }
    }

    updateMenuItemsDisplay() {
        const container = document.getElementById('menuItemsList');

        if (this.filteredMenuItems.length === 0) {
            container.innerHTML = '<p>Inga menyrätter att visa</p>';
            return;
        }

        container.innerHTML = this.filteredMenuItems.map(item => `
            <div class="item-card">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description || 'Ingen beskrivning'}</p>
                    <div class="item-meta">
                        <span><strong>${formatPrice(item.price)}</strong></span>
                        <span>Kategori: ${item.category_name || 'Okategoriserad'}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-small" onclick="menuManager.editMenuItem(${item.id})">
                        Redigera
                    </button>
                    <button class="btn btn-danger btn-small" onclick="menuManager.deleteMenuItem(${item.id})">
                        Ta bort
                    </button>
                </div>
            </div>
        `).join('');
    }

    openMenuItemModal(menuItem = null) {
        const form = document.getElementById('menuItemForm');

        if (menuItem) {
            document.getElementById('menuItemId').value = menuItem.id;
            document.getElementById('itemName').value = menuItem.name;
            document.getElementById('itemDescription').value = menuItem.description || '';
            document.getElementById('itemPrice').value = menuItem.price;
            document.getElementById('itemCategory').value = menuItem.category_id;
        } else {
            form.reset();
            document.getElementById('menuItemId').value = '';
        }

        window.adminApp.openModal('menuItemModal');
    }

    async handleMenuItemSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const menuItemData = {
            name: formData.get('itemName'),
            description: formData.get('itemDescription'),
            price: parseFloat(formData.get('itemPrice')),
            category_id: parseInt(formData.get('itemCategory'))
        };

        const menuItemId = document.getElementById('menuItemId').value;

        try {
            if (menuItemId) {
                await api.updateMenuItem(menuItemId, menuItemData);
                showNotification('Menyrätt uppdaterad!', 'success');
            } else {
                await api.createMenuItem(menuItemData);
                showNotification('Menyrätt skapad!', 'success');
            }

            window.adminApp.closeModal();
            await this.loadMenuItems();
        } catch (error) {
            console.error('Fel vid sparande av menyrätt:', error);
            showNotification(error.message || 'Kunde inte spara menyrätt', 'error');
        }
    }

    async editMenuItem(menuItemId) {
        const menuItem = this.menuItems.find(item => item.id === menuItemId);
        if (menuItem) {
            this.openMenuItemModal(menuItem);
        }
    }

    async deleteMenuItem(menuItemId) {
        const menuItem = this.menuItems.find(item => item.id === menuItemId);
        if (!menuItem) return;

        const confirmed = confirm(`Ta bort "${menuItem.name}"?`);

        if (confirmed) {
            try {
                await api.deleteMenuItem(menuItemId);
                showNotification('Menyrätt borttagen!', 'success');
                await this.loadMenuItems();
            } catch (error) {
                console.error('Fel vid borttagning av menyrätt:', error);
                showNotification('Kunde inte ta bort menyrätt', 'error');
            }
        }
    }

    filterMenuItems() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const searchTerm = document.getElementById('menuSearch').value.toLowerCase();

        this.filteredMenuItems = this.menuItems.filter(item => {
            const matchesCategory = !categoryFilter || item.category_id == categoryFilter;
            const matchesSearch = !searchTerm ||
                item.name.toLowerCase().includes(searchTerm) ||
                (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                (item.category_name && item.category_name.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesSearch;
        });

        this.updateMenuItemsDisplay();
    }
}