/**
 * Reservation-modul för Bella Vista
 * Hanterar bordsbokningar
 */

export class ReservationForm {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.form = document.getElementById('reservationForm');
        this.messageContainer = document.getElementById('reservationMessage');

        this.init();
    }

    // Starta reservation form
    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupDateRestrictions();
        }
    }

    // Sätt upp event listeners
    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Uppdatera tillgängliga tider när datum ändras
        const dateInput = document.getElementById('reservationDate');
        if (dateInput) {
            dateInput.addEventListener('change', this.updateAvailableTimes.bind(this));
        }
    }

    // Sätt upp datumbegränsningar
    setupDateRestrictions() {
        const dateInput = document.getElementById('reservationDate');
        if (dateInput) {
            // Sätt minimum datum till idag
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            dateInput.min = todayString;

            // Sätt maximum datum till 3 månader framåt
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            const maxDateString = maxDate.toISOString().split('T')[0];
            dateInput.max = maxDateString;
        }
    }

    // Sätt upp tillgängliga tider
    setupTimeSlots() {
        const timeSelect = document.getElementById('reservationTime');
        if (!timeSelect) return;

        // Öppettider: 17:00-23:00 (Mån-Tor), 17:00-24:00 (Fre-Lör), 16:00-22:00 (Sön)
        const timeSlots = this.generateTimeSlots();

        timeSelect.innerHTML = '<option value="">Välj tid</option>' +
            timeSlots.map(time => `<option value="${time}">${time}</option>`).join('');
    }

    // Generera tidsluckor
    generateTimeSlots() {
        const slots = [];

        // Grundtider (måndag-torsdag)
        const weekdayTimes = [
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
            '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
        ];

        return weekdayTimes;
    }

    // Uppdatera tillgängliga tider baserat på valt datum
    updateAvailableTimes() {
        const dateInput = document.getElementById('reservationDate');
        const timeSelect = document.getElementById('reservationTime');

        if (!dateInput.value || !timeSelect) return;

        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.getDay(); // 0 = Söndag, 6 = Lördag

        let availableTimes = [];

        if (dayOfWeek === 0) {
            // Söndag: 16:00-22:00
            availableTimes = [
                '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
                '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
            ];
        } else if (dayOfWeek === 5 || dayOfWeek === 6) {
            // Fredag-Lördag: 17:00-24:00
            availableTimes = [
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
                '23:00', '23:30', '00:00'
            ];
        } else {
            // Måndag-Torsdag: 17:00-23:00
            availableTimes = [
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
            ];
        }

        // Filtrera bort tider som redan passerat
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        if (isToday) {
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();

            availableTimes = availableTimes.filter(time => {
                const [hour, minute] = time.split(':').map(Number);
                const timeInMinutes = hour * 60 + minute;
                const currentTimeInMinutes = currentHour * 60 + currentMinute + 60; // +60 min buffer

                return timeInMinutes > currentTimeInMinutes;
            });
        }

        // Uppdatera dropdown
        timeSelect.innerHTML = '<option value="">Välj tid</option>' +
            availableTimes.map(time => `<option value="${time}">${time}</option>`).join('');
    }

    // Hantera formulärsubmission
    async handleSubmit(event) {
        event.preventDefault();

        try {
            this.setLoading(true);
            this.hideMessage();

            const formData = new FormData(this.form);
            const reservationData = {
                customer_name: formData.get('customerName'),
                customer_email: formData.get('customerEmail'),
                customer_phone: formData.get('customerPhone'),
                reservation_date: formData.get('reservationDate'),
                reservation_time: formData.get('reservationTime'),
                party_size: parseInt(formData.get('partySize')),
                special_requests: formData.get('specialRequests') || ''
            };

            // Validera data
            const validation = this.validateReservationData(reservationData);
            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            // Skicka bokning
            const response = await fetch(`${this.apiBaseUrl}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunde inte skicka bokning');
            }

            const result = await response.json();

            // Visa framgångsmeddelande
            this.showMessage(
                result.confirmationMessage || 'Tack för din bokning! Vi återkommer med bekräftelse.',
                'success'
            );

            // Rensa formulär
            this.form.reset();
            this.setupTimeSlots();

        } catch (error) {
            console.error('Fel vid bokning:', error);
            this.showMessage(error.message || 'Kunde inte skicka bokning. Försök igen senare.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Validera bokningsdata
    validateReservationData(data) {
        // Kontrollera obligatoriska fält
        if (!data.customer_name || data.customer_name.trim().length < 2) {
            return { isValid: false, message: 'Ange ett giltigt namn (minst 2 tecken)' };
        }

        if (!data.customer_email || !this.isValidEmail(data.customer_email)) {
            return { isValid: false, message: 'Ange en giltig e-postadress' };
        }

        if (!data.customer_phone || !this.isValidPhone(data.customer_phone)) {
            return { isValid: false, message: 'Ange ett giltigt telefonnummer' };
        }

        if (!data.reservation_date) {
            return { isValid: false, message: 'Välj ett datum för bokningen' };
        }

        if (!data.reservation_time) {
            return { isValid: false, message: 'Välj en tid för bokningen' };
        }

        if (!data.party_size || data.party_size < 1 || data.party_size > 20) {
            return { isValid: false, message: 'Antal personer måste vara mellan 1 och 20' };
        }

        // Kontrollera att datumet inte är i det förflutna
        const reservationDate = new Date(`${data.reservation_date}T${data.reservation_time}`);
        const now = new Date();

        if (reservationDate <= now) {
            return { isValid: false, message: 'Bokning kan inte göras för datum/tid som redan passerat' };
        }

        return { isValid: true };
    }

    // Validera e-postadress
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validera telefonnummer
    isValidPhone(phone) {
        const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
        return phoneRegex.test(phone);
    }

    // Sätt laddningsstatus
    setLoading(isLoading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? 'Skickar bokning...' : 'Skicka bokning';
        }
    }

    // Visa meddelande
    showMessage(message, type = 'info') {
        if (this.messageContainer) {
            this.messageContainer.textContent = message;
            this.messageContainer.className = `form__message form__message--${type}`;
            this.messageContainer.style.display = 'block';

            // Scrolla till meddelandet
            this.messageContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    // Dölj meddelande
    hideMessage() {
        if (this.messageContainer) {
            this.messageContainer.style.display = 'none';
        }
    }
}