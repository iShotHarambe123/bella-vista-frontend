/**
 * Bella Vista Frontend - Main Entry Point
 */

// Importera CSS
import '../css/main.css';

// Importera moduler
import { Navigation } from './modules/navigation.js';
import { LoadingManager } from './modules/loading.js';

class BellaVistaApp {
    constructor() {
        this.apiBaseUrl = process.env.NODE_ENV === 'production'
            ? '/api'
            : 'http://localhost:3000/api';
        this.init();
    }

    async init() {
        try {
            LoadingManager.show();
            this.setupComponents();
            this.setupEventListeners();
            LoadingManager.hide();
            console.log('App initierad');
        } catch (error) {
            console.error('Fel vid initiering:', error);
            LoadingManager.hide();
        }
    }

    setupComponents() {
        this.navigation = new Navigation();
    }

    setupEventListeners() {
        document.addEventListener('click', this.handleLinkClick.bind(this));
    }

    handleLinkClick(event) {
        const link = event.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            event.preventDefault();
            this.scrollToSection(href.substring(1));
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bellaVistaApp = new BellaVistaApp();
});

export { BellaVistaApp };