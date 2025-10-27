/**
 * Category Manager för Bella Vista Admin
 * Hanterar CRUD-operationer för kategorier
 */

class CategoryManager {
    constructor() {
        this.categories = [];
        this.setupEventListeners();
    }

    /**
     * Sätt upp event listeners
     */
    setupEventListeners() {
        // Lägg till kategori-knapp
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        // Kategori-formulär
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            this.handleCategorySubmit(e);
        });
    }

    /**
     * Ladda alla kategorier
     */
    async loadCategories() {
        try {
            console.log('Laddar kategorier...');
            this.categories = await api.getCategories();
            console.log('Kategorier laddade:', this.categories);
            this.updateCategoriesDisplay();
        } catch (error) {
            console.error('Fel vid laddning av kategorier:', error);
            showNotification(`Kunde inte ladda kategorier: ${error.message}`, 'error');
        }
    }

    /**
     * Uppdatera kategori-visning
     */
    updateCategoriesDisplay() {
        const container = document.getElementById('categoriesList');

        if (this.categories.length === 0) {
            container.innerHTML = '<p style="color: #64748b; text-align: center; padding: 40px;">Inga kategorier att visa</p>';
            return;
        }

        container.innerHTML = this.categories.map(category => `
            <div class="item-card">
                <div class="item-info">
                    <h4>${this.escapeHtml(category.name)}</h4>
                    <p>${this.escapeHtml(category.description || 'Ingen beskrivning')}</p>
                    <div class="item-meta">
                        <span>Sorteringsordning: ${category.sort_order}</span>
                        <span>Skapad: ${formatDate(category.created_at)}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-small" onclick="categoryManager.editCategory(${category.id})">
                        Redigera
                    </button>
                    <button class="btn btn-danger btn-small" onclick="categoryManager.deleteCategory(${category.id})">
                        Ta bort
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Öppna kategori-modal för ny kategori
     */
    openCategoryModal(category = null) {
        const modal = document.getElementById('categoryModal');
        const title = document.getElementById('categoryModalTitle');
        const form = document.getElementById('categoryForm');

        if (category) {
            // Redigera befintlig kategori
            title.textContent = 'Redigera kategori';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryDescription').value = category.description || '';
            document.getElementById('categorySortOrder').value = category.sort_order;
        } else {
            // Ny kategori
            title.textContent = 'Lägg till kategori';
            form.reset();
            document.getElementById('categoryId').value = '';
        }

        window.adminApp.openModal('categoryModal');
    }

    /**
     * Hantera kategori-formulär submit
     */
    async handleCategorySubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const categoryData = {
            name: formData.get('categoryName'),
            description: formData.get('categoryDescription'),
            sort_order: parseInt(formData.get('categorySortOrder')) || 0
        };

        const categoryId = document.getElementById('categoryId').value;

        try {
            if (categoryId) {
                // Uppdatera befintlig kategori
                await api.updateCategory(categoryId, categoryData);
                showNotification('Kategori uppdaterad!', 'success');
            } else {
                // Skapa ny kategori
                await api.createCategory(categoryData);
                showNotification('Kategori skapad!', 'success');
            }

            window.adminApp.closeModal();
            await this.loadCategories();

            // Uppdatera meny-dropdown om den finns
            if (window.menuManager) {
                window.menuManager.loadCategoryOptions();
            }
        } catch (error) {
            console.error('Fel vid sparande av kategori:', error);
            showNotification(error.message || 'Kunde inte spara kategori', 'error');
        }
    }

    /**
     * Redigera kategori
     */
    async editCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            this.openCategoryModal(category);
        } else {
            showNotification('Kategori hittades inte', 'error');
        }
    }

    /**
     * Ta bort kategori
     */
    async deleteCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;

        const confirmed = confirm(`Är du säker på att du vill ta bort kategorin "${category.name}"?\n\nObs: Kategorin kan inte tas bort om den innehåller menyrätter.`);

        if (confirmed) {
            try {
                await api.deleteCategory(categoryId);
                showNotification('Kategori borttagen!', 'success');
                await this.loadCategories();

                // Uppdatera meny-dropdown om den finns
                if (window.menuManager) {
                    window.menuManager.loadCategoryOptions();
                }
            } catch (error) {
                console.error('Fel vid borttagning av kategori:', error);
                showNotification(error.message || 'Kunde inte ta bort kategori', 'error');
            }
        }
    }

    /**
     * Hämta kategorier för dropdown
     */
    getCategoriesForDropdown() {
        return this.categories.map(category => ({
            value: category.id,
            text: category.name
        }));
    }

    /**
     * Escape HTML för säkerhet
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}