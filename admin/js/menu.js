/**
 * Menu Manager för Bella Vista Admin
 * Hanterar CRUD-operationer för menyrätter
 */
class MenuManager {
    constructor() {
        this.menuItems = [];
        this.categories = [];
        this.setupEventListeners();
    }

    // Sätt upp event listeners
    setupEventListeners() {
        document.getElementById('addMenuItemBtn').addEventListener('click', () => {
            this.openMenuItemModal();
        });
    }

    // Ladda alla menyrätter
    async loadMenuItems() {
        try {
            console.log('Laddar menyrätter...');
            this.menuItems = await api.getAllMenuItems();
            console.log('Menyrätter laddade:', this.menuItems);
            await this.loadCategories();
            this.updateMenuItemsDisplay();
        } catch (error) {
            console.error('Fel vid laddning av menyrätter:', error);
            showNotification(`Kunde inte ladda menyrätter: ${error.message}`, 'error');
        }
    }

    // Ladda kategorier
    async loadCategories() {
        try {
            console.log('Laddar kategorier...');
            this.categories = await api.getCategories();
            console.log('Kategorier laddade:', this.categories);
        } catch (error) {
            console.error('Fel vid laddning av kategorier:', error);
            showNotification(`Kunde inte ladda kategorier: ${error.message}`, 'error');
        }
    }

    // Uppdatera menyrätt-visning
    updateMenuItemsDisplay() {
        const container = document.getElementById('menuItemsList');

        if (this.menuItems.length === 0) {
            container.innerHTML = '<p>Inga menyrätter att visa</p>';
            return;
        }

        container.innerHTML = this.menuItems.map(item => `
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

    // Öppna menyrätt-modal
    openMenuItemModal(menuItem = null) {
        console.log('Menyrätt-modal kommer att implementeras...');
        showNotification('Menyhantering kommer snart!', 'info');
    }

    // Redigera menyrätt
    async editMenuItem(menuItemId) {
        const menuItem = this.menuItems.find(item => item.id === menuItemId);
        if (menuItem) {
            this.openMenuItemModal(menuItem);
        }
    }

    // Ta bort menyrätt
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
}