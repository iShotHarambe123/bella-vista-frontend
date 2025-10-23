/**
 * Navigation-klass för Bella Vista
 * Hanterar mobilmeny, scroll-effekter och aktiva länkar
 */
export class Navigation {
    constructor() {
        // Hämta DOM-element
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav__link');

        // Håll koll på meny-status och scroll-position
        this.isMenuOpen = false;
        this.lastScrollY = window.scrollY;

        this.init();
    }

    // Starta allt
    init() {
        this.setupEventListeners();
        this.updateActiveLink();
        this.handleScroll();
    }

    // Sätt upp alla event listeners
    setupEventListeners() {
        // Hamburger-knapp för mobil
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Stäng meny när man klickar på en länk
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Stäng meny om man klickar utanför
        document.addEventListener('click', (event) => {
            if (this.isMenuOpen && !this.navMenu.contains(event.target) && !this.navToggle.contains(event.target)) {
                this.closeMobileMenu();
            }
        });

        // Hantera scroll-effekter
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
            this.updateActiveLink();
        }, 16));

        // Stäng meny med Escape-tangent
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    // Öppna/stäng mobilmeny
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;

        // Växla CSS-klasser för animation
        this.navToggle.classList.toggle('nav__toggle--active');
        this.navMenu.classList.toggle('nav__menu--active');

        // Förhindra scrolling när meny är öppen
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';

        // Tillgänglighet
        this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
        this.navMenu.setAttribute('aria-hidden', !this.isMenuOpen);
    }

    // Stäng mobilmeny
    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            this.navToggle.classList.remove('nav__toggle--active');
            this.navMenu.classList.remove('nav__menu--active');
            document.body.style.overflow = '';

            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navMenu.setAttribute('aria-hidden', 'true');
        }
    }

    // Hantera scroll-effekter på header
    handleScroll() {
        const currentScrollY = window.scrollY;

        // Lägg till bakgrund när man scrollar ner
        if (currentScrollY > 50) {
            this.header.classList.add('header--scrolled');
        } else {
            this.header.classList.remove('header--scrolled');
        }

        // Dölj header på mobil när man scrollar ner
        if (window.innerWidth <= 768) {
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.header.classList.add('header--hidden');
            } else {
                this.header.classList.remove('header--hidden');
            }
        }

        this.lastScrollY = currentScrollY;
    }

    // Uppdatera vilken länk som är aktiv baserat på scrollposition
    updateActiveLink(forcedSection = null) {
        if (forcedSection) {
            this.setActiveLink(forcedSection);
            return;
        }

        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        let currentSection = '';

        // Kolla vilken sektion som är synlig
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            this.setActiveLink(currentSection);
        }
    }

    // Markera rätt länk som aktiv
    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Hantera när fönstret ändrar storlek
    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }

        if (window.innerWidth > 768) {
            this.header.classList.remove('header--hidden');
        }
    }

    // Begränsa hur ofta en funktion kan köras
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Scrolla till en specifik sektion
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            this.updateActiveLink(sectionId);
            this.closeMobileMenu();
        }
    }
}