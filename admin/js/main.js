/**
 * Huvudapplikation för Bella Vista Admin
 * Hanterar navigation och grundläggande funktionalitet
 */
class AdminApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isMobileMenuOpen = false;
        this.init();
    }

    // Initiera appen
    init() {
        this.setupNavigation();
        this.setupMobileMenu();
    }

    // Sätt upp navigation
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

    // Sätt upp mobilmeny
    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const adminNav = document.getElementById('adminNav');

        if (mobileToggle && adminNav) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Stäng meny när man klickar utanför
            document.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen &&
                    !adminNav.contains(e.target) &&
                    !mobileToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Stäng meny med Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    // Växla mobilmeny
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

        // Förhindra scrollning när meny är öppen
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    // Stäng mobilmeny
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

    // Navigera till sektion
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

    // Ladda data för sektion
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

    // Ladda dashboard
    async loadDashboard() {
        try {
            // Sätt placeholder-värden
            document.getElementById('totalReservations').textContent = '-';
            document.getElementById('pendingReservations').textContent = '-';
            document.getElementById('confirmedReservations').textContent = '-';
            document.getElementById('todayReservations').textContent = '-';

            // Visa meddelande att dashboard laddas
            const recentList = document.getElementById('recentReservationsList');
            if (recentList) {
                recentList.innerHTML = '<p>Dashboard kommer att implementeras i nästa commit...</p>';
            }
        } catch (error) {
            console.error('Fel vid laddning av dashboard:', error);
        }
    }
}

// Hjälpfunktioner
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const container = document.getElementById('notifications');
    container.appendChild(notification);

    // Visa notifikation
    setTimeout(() => {
        notification.classList.add('notification--show');
    }, 100);

    // Ta bort notifikation efter 3 sekunder
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

// Starta app när DOM är laddad
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
    window.dashboardManager = new DashboardManager();
    window.menuManager = new MenuManager();
    window.categoryManager = new CategoryManager();
    window.reservationManager = new ReservationManager();
});