/**
 * API Client för Bella Vista Admin
 * Hanterar all kommunikation med backend
 */
class ApiClient {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/api'
            : '/api';
        this.token = localStorage.getItem('authToken');
    }

    // Sätt JWT token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Hämta headers för requests
    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Grundläggande request metod
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Något gick fel');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Categories endpoints
    async getCategories() {
        return this.request('/categories');
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    }

    async updateCategory(id, categoryData) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    }

    async deleteCategory(id) {
        return this.request(`/categories/${id}`, { method: 'DELETE' });
    }

    // Menu endpoints
    async getAllMenuItems() {
        return this.request('/menu/all');
    }

    async createMenuItem(itemData) {
        return this.request('/menu', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    }

    async updateMenuItem(id, itemData) {
        return this.request(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
        });
    }

    async deleteMenuItem(id) {
        return this.request(`/menu/${id}`, { method: 'DELETE' });
    }

    // Reservations endpoints
    async getReservations() {
        return this.request('/reservations');
    }

    async updateReservationStatus(id, status) {
        return this.request(`/reservations/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async deleteReservation(id) {
        return this.request(`/reservations/${id}`, { method: 'DELETE' });
    }
}

const api = new ApiClient();