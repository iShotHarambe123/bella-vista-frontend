/**
 * Reservation Manager för Bella Vista Admin
 * Hanterar bokningar och statusuppdateringar
 */
class ReservationManager {
    constructor() {
        this.reservations = [];
        this.filteredReservations = [];
        this.setupEventListeners();
    }

    // Sätt upp event listeners
    setupEventListeners() {
        // Filter event listeners
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterReservations();
            });
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.filterReservations();
            });
        }
    }

    // Ladda alla bokningar
    async loadReservations() {
        try {
            console.log('Laddar bokningar...');
            this.reservations = await api.getReservations();
            console.log('Bokningar laddade:', this.reservations);
            this.filteredReservations = [...this.reservations];
            this.updateReservationsDisplay();
        } catch (error) {
            console.error('Fel vid laddning av bokningar:', error);
            showNotification(`Kunde inte ladda bokningar: ${error.message}`, 'error');
        }
    }

    // Filtrera bokningar
    filterReservations() {
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;

        this.filteredReservations = this.reservations.filter(reservation => {
            const matchesStatus = !statusFilter || reservation.status === statusFilter;
            const matchesDate = !dateFilter || reservation.reservation_date === dateFilter;
            return matchesStatus && matchesDate;
        });

        this.updateReservationsDisplay();
    }

    // Uppdatera boknings-visning
    updateReservationsDisplay() {
        const container = document.getElementById('reservationsList');

        if (this.filteredReservations.length === 0) {
            container.innerHTML = '<p>Inga bokningar att visa</p>';
            return;
        }

        container.innerHTML = this.filteredReservations.map(reservation => `
            <div class="reservation-card">
                <div class="item-info">
                    <h4>${reservation.customer_name}</h4>
                    <p>${reservation.customer_email} • ${reservation.customer_phone}</p>
                    <div class="item-meta">
                        <span>${formatDate(reservation.reservation_date)}</span>
                        <span>${reservation.reservation_time}</span>
                        <span>${reservation.party_size} personer</span>
                        <span class="status-badge status-${reservation.status}">${this.getStatusText(reservation.status)}</span>
                    </div>
                    ${reservation.special_requests ? `
                        <p><strong>Särskilda önskemål:</strong> ${reservation.special_requests}</p>
                    ` : ''}
                </div>
                <div class="item-actions">
                    ${this.getStatusActions(reservation)}
                    <button class="btn btn-danger btn-small" onclick="reservationManager.deleteReservation(${reservation.id})">
                        Ta bort
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Hämta statustext på svenska
    getStatusText(status) {
        const statusTexts = {
            'pending': 'Väntande',
            'confirmed': 'Bekräftad',
            'cancelled': 'Avbokad',
            'completed': 'Genomförd'
        };
        return statusTexts[status] || status;
    }

    // Hämta statusspecifika åtgärder
    getStatusActions(reservation) {
        const actions = [];

        switch (reservation.status) {
            case 'pending':
                actions.push(`
                    <button class="btn btn-success btn-small" onclick="reservationManager.updateStatus(${reservation.id}, 'confirmed')">
                        Bekräfta
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="reservationManager.updateStatus(${reservation.id}, 'cancelled')">
                        Avboka
                    </button>
                `);
                break;

            case 'confirmed':
                actions.push(`
                    <button class="btn btn-success btn-small" onclick="reservationManager.updateStatus(${reservation.id}, 'completed')">
                        Markera genomförd
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="reservationManager.updateStatus(${reservation.id}, 'cancelled')">
                        Avboka
                    </button>
                `);
                break;

            case 'cancelled':
                actions.push(`
                    <button class="btn btn-success btn-small" onclick="reservationManager.updateStatus(${reservation.id}, 'confirmed')">
                        Återaktivera
                    </button>
                `);
                break;

            case 'completed':
                actions.push(`
                    <button class="btn btn-secondary btn-small" onclick="reservationManager.updateStatus(${reservation.id}, 'confirmed')">
                        Markera aktiv
                    </button>
                `);
                break;
        }

        return actions.join('');
    }

    // Uppdatera bokningsstatus
    async updateStatus(reservationId, newStatus) {
        try {
            await api.updateReservationStatus(reservationId, newStatus);
            showNotification(`Status uppdaterad till ${this.getStatusText(newStatus)}!`, 'success');

            const reservation = this.reservations.find(r => r.id === reservationId);
            if (reservation) {
                reservation.status = newStatus;
            }

            this.filteredReservations = [...this.reservations];
            this.updateReservationsDisplay();

            // Uppdatera dashboard om det är synligt
            if (window.dashboardManager && window.adminApp.currentSection === 'dashboard') {
                window.dashboardManager.loadDashboard();
            }
        } catch (error) {
            console.error('Fel vid uppdatering av bokningsstatus:', error);
            showNotification('Kunde inte uppdatera status', 'error');
        }
    }

    // Ta bort bokning
    async deleteReservation(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) return;

        const confirmed = confirm(`Ta bort bokningen för ${reservation.customer_name}?`);

        if (confirmed) {
            try {
                await api.deleteReservation(reservationId);
                showNotification('Bokning borttagen!', 'success');
                this.reservations = this.reservations.filter(r => r.id !== reservationId);
                this.filteredReservations = [...this.reservations];
                this.updateReservationsDisplay();
            } catch (error) {
                console.error('Fel vid borttagning av bokning:', error);
                showNotification('Kunde inte ta bort bokning', 'error');
            }
        }
    }
}