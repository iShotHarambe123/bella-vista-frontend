class DashboardManager {
    constructor() {
        this.recentReservations = [];
        this.allReservations = [];
    }

    async loadDashboard() {
        try {
            await this.loadReservations();
            this.updateStats();
            this.updateRecentReservationsDisplay();
        } catch (error) {
            console.error('Fel vid laddning av dashboard:', error);
            showNotification('Kunde inte ladda dashboard-data', 'error');
        }
    }

    async loadReservations() {
        try {
            this.allReservations = await api.getReservations();
            this.recentReservations = this.allReservations.slice(0, 5);
        } catch (error) {
            console.error('Fel vid laddning av bokningar:', error);
            this.allReservations = [];
            this.recentReservations = [];
        }
    }

    updateStats() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        const stats = {
            total: this.allReservations.length,
            pending: this.allReservations.filter(r => r.status === 'pending').length,
            confirmed: this.allReservations.filter(r => r.status === 'confirmed').length,
            today: this.allReservations.filter(r => r.reservation_date === today).length
        };

        // Uppdatera DOM-element
        document.getElementById('totalReservations').textContent = stats.total;
        document.getElementById('pendingReservations').textContent = stats.pending;
        document.getElementById('confirmedReservations').textContent = stats.confirmed;
        document.getElementById('todayReservations').textContent = stats.today;
    }

    updateRecentReservationsDisplay() {
        const container = document.getElementById('recentReservationsList');

        if (this.recentReservations.length === 0) {
            container.innerHTML = '<p>Inga bokningar att visa</p>';
            return;
        }

        container.innerHTML = this.recentReservations.map(reservation => `
            <div class="reservation-card">
                <div class="item-info">
                    <h4>${reservation.customer_name}</h4>
                    <p>${reservation.customer_email}</p>
                    <div class="item-meta">
                        <span>${formatDate(reservation.reservation_date)}</span>
                        <span>${reservation.reservation_time}</span>
                        <span>${reservation.party_size} personer</span>
                        <span class="status-${reservation.status}">${reservation.status}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}