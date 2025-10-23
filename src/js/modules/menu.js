/**
 * MenuLoader-klass för Bella Vista
 * Laddar och visar meny från API:et
 */
export class MenuLoader {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.menuData = [];
        this.currentCategory = 'all';

        // Hämta DOM-element
        this.menuContainer = document.getElementById('menuContent');
        this.categoriesContainer = document.getElementById('menuCategories');

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // event listeners
    setupEventListeners() {

    }

    // Ladda meny från API
    async loadMenu() {
        try {
            this.showLoading();

            const response = await fetch(`${this.apiBaseUrl}/menu`);

            if (!response.ok) {
                throw new Error('Kunde inte ladda meny');
            }

            const data = await response.json();
            this.menuData = data.menu || [];

            this.renderCategories();
            this.renderMenu();

        } catch (error) {
            console.error('Fel vid laddning av meny:', error);
            this.showError('Kunde inte ladda menyn. Försök igen senare.');
            this.loadFallbackMenu();
        }
    }

    // Visa laddningsindikator
    showLoading() {
        if (this.menuContainer) {
            this.menuContainer.innerHTML = `
                <div class="menu__loading">
                    <div class="loading-spinner"></div>
                    <p>Laddar meny...</p>
                </div>
            `;
        }
    }

    // Visa felmeddelande
    showError(message) {
        if (this.menuContainer) {
            this.menuContainer.innerHTML = `
                <div class="menu__error">
                    <p>${message}</p>
                    <button class="btn btn--primary" onclick="window.bellaVistaApp.menuLoader.loadMenu()">
                        Försök igen
                    </button>
                </div>
            `;
        }
    }

    // Ladda fallback-meny om API:et inte fungerar
    loadFallbackMenu() {
        this.menuData = [
            {
                category: {
                    id: 1,
                    name: 'Antipasti',
                    description: 'Italienska förrätter'
                },
                items: [
                    {
                        id: 1,
                        name: 'Bruschetta Classica',
                        description: 'Rostade bröd med tomater, basilika och vitlök',
                        price: 95,
                        allergens: 'Gluten'
                    },
                    {
                        id: 2,
                        name: 'Antipasto Misto',
                        description: 'Blandad italiensk charkuteritallrik',
                        price: 165,
                        allergens: 'Mjölk'
                    }
                ]
            },
            {
                category: {
                    id: 2,
                    name: 'Primi Piatti',
                    description: 'Pasta och risotto'
                },
                items: [
                    {
                        id: 3,
                        name: 'Spaghetti Carbonara',
                        description: 'Klassisk pasta med ägg, pecorino och guanciale',
                        price: 185,
                        allergens: 'Gluten, Ägg, Mjölk'
                    },
                    {
                        id: 4,
                        name: 'Risotto ai Funghi',
                        description: 'Krämig svamprisotto med parmigiano',
                        price: 195,
                        allergens: 'Mjölk'
                    }
                ]
            }
        ];

        this.renderCategories();
        this.renderMenu();
    }

    // Rendera kategori-knappar
    renderCategories() {
        if (!this.categoriesContainer) return;

        const categories = ['all', ...this.menuData.map(section => section.category.name)];

        this.categoriesContainer.innerHTML = categories.map(category => `
            <button class="menu__category-btn ${category === this.currentCategory ? 'active' : ''}" 
                    data-category="${category}">
                ${category === 'all' ? 'Alla rätter' : category}
            </button>
        `).join('');

        // Lägg till eventlisteners för kategori-knappar
        this.categoriesContainer.querySelectorAll('.menu__category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    // Filtrera meny efter kategori
    filterByCategory(category) {
        this.currentCategory = category;

        // Uppdatera aktiv knapp
        this.categoriesContainer.querySelectorAll('.menu__category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        this.renderMenu();
    }

    // Rendera meny-innehåll
    renderMenu() {
        if (!this.menuContainer) return;

        let sectionsToShow = this.menuData;

        // Filtrera efter vald kategori
        if (this.currentCategory !== 'all') {
            sectionsToShow = this.menuData.filter(section =>
                section.category.name === this.currentCategory
            );
        }

        if (sectionsToShow.length === 0) {
            this.menuContainer.innerHTML = `
                <div class="menu__empty">
                    <p>Inga rätter att visa i denna kategori.</p>
                </div>
            `;
            return;
        }

        // Rendera alla sektioner
        this.menuContainer.innerHTML = sectionsToShow.map(section => `
            <div class="menu__section">
                <div class="menu__section-header">
                    <h3 class="menu__section-title">${this.escapeHtml(section.category.name)}</h3>
                    ${section.category.description ? `
                        <p class="menu__section-description">${this.escapeHtml(section.category.description)}</p>
                    ` : ''}
                </div>
                
                <div class="menu__items">
                    ${section.items.map(item => this.renderMenuItem(item)).join('')}
                </div>
            </div>
        `).join('');

        // Lägg till fade in animation
        this.menuContainer.querySelectorAll('.menu__item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in');
        });
    }

    // Rendera en enskild menyrätt
    renderMenuItem(item) {
        return `
            <div class="menu__item">
                ${item.image_url ? `
                    <div class="menu__item-image">
                        <img src="${item.image_url}" alt="${this.escapeHtml(item.name)}" loading="lazy">
                    </div>
                ` : ''}
                
                <div class="menu__item-content">
                    <div class="menu__item-header">
                        <h4 class="menu__item-name">${this.escapeHtml(item.name)}</h4>
                        <span class="menu__item-price">${this.formatPrice(item.price)}</span>
                    </div>
                    
                    ${item.description ? `
                        <p class="menu__item-description">${this.escapeHtml(item.description)}</p>
                    ` : ''}
                    
                    ${item.allergens ? `
                        <div class="menu__item-allergens">
                            <small><strong>Allergener:</strong> ${this.escapeHtml(item.allergens)}</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Formatera pris
    formatPrice(price) {
        return `${price} SEK`;
    }

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}