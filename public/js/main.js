
// Auto-hide flash alerts
const alert = document.querySelector('.alert');

if (alert) {
    setTimeout(() => {
        alert.style.opacity = '0';
    }, 5000);
    setTimeout(() => {
        alert.style.height = '0';
        alert.style.padding = '0';
        alert.style.margin = '0';
    }, 5500);
}

// Header nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteHeader = document.querySelector('.site-header');
const primaryNav = document.querySelector('#primary-nav');

if (navToggle && siteHeader && primaryNav) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        siteHeader.classList.toggle('nav-open');
    });

    // Close nav when clicking outside on small screens
    document.addEventListener('click', (e) => {
        if (!siteHeader.classList.contains('nav-open')) return;
        if (siteHeader.contains(e.target)) return;
        siteHeader.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && siteHeader.classList.contains('nav-open')) {
            siteHeader.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    });
}