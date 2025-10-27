class AdminApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModals();
        this.setupMobileMenu();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.navigateToSection(section);
                this.closeMobileMenu();
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const adminNav = document.getElementById('adminNav');

        if (mobileToggle && adminNav) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            document.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen &&
                    !adminNav.contains(e.target) &&
                    !mobileToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const adminNav = document.getElementById('adminNav');

        this.isMobileMenuOpen = !this.isMobileMenuOpen;

        if (mobileToggle) {
            mobileToggle.classList.toggle('active', this.isMobileMenuOpen);
        }

        if (adminNav) {
            adminNav.classList.toggle('open', this.isMobileMenuOpen);
        }

        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;

            const mobileToggle = document.getElementById('mobileMenuToggle');
            const adminNav = document.getElementById('adminNav');

            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }

            if (adminNav) {
                adminNav.classList.remove('open');
            }

            document.body.style.overflow = '';
        }
    }

    navigateToSection(sectionName) {
        // Uppdatera navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Visa sektion
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}Section`).classList.add('active');

        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                if (window.dashboardManager) window.dashboardManager.loadDashboard();
                break;
            case 'menu':
                if (window.menuManager) window.menuManager.loadMenuItems();
                break;
            case 'categories':
                if (window.categoryManager) window.categoryManager.loadCategories();
                break;
            case 'reservations':
                if (window.reservationManager) window.reservationManager.loadReservations();
                break;
        }
    }

    setupModals() {
        const modalOverlay = document.getElementById('modalOverlay');
        const closeButtons = document.querySelectorAll('.modal-close');

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(modalId) {
        document.getElementById('modalOverlay').style.display = 'flex';
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
        document.querySelectorAll('.modal form').forEach(form => {
            form.reset();
        });
    }
}

// Hjälpfunktioner
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.getElementById('notifications').appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('sv-SE');
}

function formatPrice(price) {
    return `${price} SEK`;
}

function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Starta app
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
    window.dashboardManager = new DashboardManager();
    window.menuManager = new MenuManager();
    window.categoryManager = new CategoryManager();
    window.reservationManager = new ReservationManager();
});