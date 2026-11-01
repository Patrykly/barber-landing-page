/**
 * The Razor's Edge - Main script application
 * Modular architecture, Vanilla JS (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPortfolioFilter();
    initTestimonialsSlider();
    initContactForm();
});

/**
 * 1. Mobile Navigation (Hamburger menu with ARIA and scroll blocking)
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    const toggleMenu = () => {
        const isOpened = navToggle.classList.contains('active');
        const nextState = !isOpened;

        navToggle.classList.toggle('active', nextState);
        navMenu.classList.toggle('active', nextState);
        navToggle.setAttribute('aria-expanded', String(nextState));
        document.body.classList.toggle('no-scroll', nextState);
    };

    const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * 2. Portfolio Gallery Filtering (Based only on CSS classes)
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (!filterButtons.length || !portfolioCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            const selectedFilter = btn.dataset.filter;

            // Filtering with CSS animation preservation
            portfolioCards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = (selectedFilter === 'all' || category === selectedFilter);

                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });
}

/**
 * 3. Testimonials Carousel (Auto-slide + Pause on hover)
 */
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const sliderContainer = document.querySelector('.testimonials-slider-wrapper');
    const intervalDuration = 6000;
    
    let currentIndex = 0;
    let timerId = null;

    if (!slides.length || !dots.length) return;

    const setSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        dots[index].setAttribute('aria-selected', 'true');
        currentIndex = index;
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        setSlide(nextIndex);
    };

    const startTimer = () => {
        stopTimer();
        timerId = setInterval(nextSlide, intervalDuration);
    };

    const stopTimer = () => {
        if (timerId) clearInterval(timerId);
    };

    // Navigation dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setSlide(index);
            startTimer();
        });
    });

    // Stopping automatic scrolling when the user reads the testimonial
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopTimer);
        sliderContainer.addEventListener('mouseleave', startTimer);
    }

    startTimer();
}

/**
 * 4. Validation and Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('barberContactForm');
    const successAlert = document.getElementById('successMessage');

    if (!form) return;

    const clearError = (input) => {
        const group = input.parentElement;
        const errorDisplay = group.querySelector('.error-msg');
        group.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        if (errorDisplay) errorDisplay.textContent = '';
    };

    const setError = (input, message) => {
        const group = input.parentElement;
        const errorDisplay = group.querySelector('.error-msg');
        group.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        if (errorDisplay) errorDisplay.textContent = message;
    };

    const validateField = (input) => {
        const value = input.value.trim();

        // Required field
        if (!value) {
            setError(input, 'To pole jest wymagane.');
            return false;
        }

        // Email validation
        if (input.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setError(input, 'Podaj prawidłowy adres e-mail.');
                return false;
            }
        }

        // Phone validation (handles international formats, spaces, dashes)
        if (input.id === 'phone') {
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
            if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                setError(input, 'Podaj prawidłowy numer telefonu (np. +48 500 600 700).');
                return false;
            }
        }

        clearError(input);
        return true;
    };

    // Clearing errors while typing
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => clearError(field));
    });

    // Handling submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            successAlert.hidden = false;
            form.reset();

            setTimeout(() => {
                successAlert.hidden = true;
            }, 6000);
        }
    });
}