/**
 * Auth Manager för Bella Vista Admin
 * Hanterar inloggning och autentisering
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    // Initiera auth manager
    async init() {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.setToken(token);
            this.showAdminApp();
        } else {
            this.showLogin();
        }
    }

    // Logga in användare
    async login(credentials) {
        try {
            const response = await api.login(credentials);
            api.setToken(response.token);
            this.currentUser = response.user;
            this.showAdminApp();
            showNotification('Inloggning lyckades!', 'success');
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Logga ut användare
    logout() {
        api.setToken(null);
        this.currentUser = null;
        this.showLogin();
        showNotification('Du har loggats ut', 'info');
    }

    // Visa inloggningsformulär
    showLogin() {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('adminApp').style.display = 'none';
    }

    // Visa admin-appen
    showAdminApp() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminApp').style.display = 'grid';

        // Visa användarinfo
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.currentUser) {
            userInfo.textContent = `Inloggad som: ${this.currentUser.username}`;
        }
    }
}

const authManager = new AuthManager();

// Event listeners för inloggning
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const credentials = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            const errorElement = document.getElementById('loginError');
            errorElement.style.display = 'none';

            try {
                await authManager.login(credentials);
            } catch (error) {
                errorElement.textContent = error.message || 'Inloggning misslyckades';
                errorElement.style.display = 'block';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authManager.logout();
        });
    }
});