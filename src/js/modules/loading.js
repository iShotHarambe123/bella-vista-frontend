/**
 * Loading Manager för Bella Vista
 * Hanterar laddningsindikatorer
 */

export class LoadingManager {
    /**
     * Visa global laddningsindikator
     */
    static show() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
    }

    /**
     * Dölj global laddningsindikator
     */
    static hide() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * Skapa och visa laddningsindikator för specifikt element
     */
    static showForElement(element, message = 'Laddar...') {
        if (!element) return;

        const loader = document.createElement('div');
        loader.className = 'element-loading';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;

        // Lägg till loader som första child
        element.insertBefore(loader, element.firstChild);

        return loader;
    }

    /**
     * Ta bort laddningsindikator från element
     */
    static hideForElement(element) {
        if (!element) return;

        const loader = element.querySelector('.element-loading');
        if (loader) {
            loader.remove();
        }
    }

    /**
     * Visa laddningsindikator för knapp
     */
    static showForButton(button, loadingText = 'Laddar...') {
        if (!button) return;

        const originalText = button.textContent;
        button.textContent = loadingText;
        button.disabled = true;
        button.classList.add('loading');

        return {
            restore: () => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('loading');
            }
        };
    }
}