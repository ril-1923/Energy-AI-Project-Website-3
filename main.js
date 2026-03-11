// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAnimations();
    initNewsletterForm();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('mainNav');
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation initialization
function initAnimations() {
    // Fade in animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in, .feature-card, .benefit-item, .service-card, .team-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Newsletter form handling
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button[type="submit"]');
            const successMessage = form.parentElement.querySelector('.success-message') || 
                                 document.getElementById('newsletterSuccess');
            
            if (validateEmail(email)) {
                // Show loading state
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="loading"></span> Subscribing...';
                button.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                    
                    // Show success message
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.classList.add('fade-in', 'visible');
                        
                        // Hide after 5 seconds
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 5000);
                    }
                    
                    // Reset form
                    form.reset();
                }, 2000);
            } else {
                showError(form, 'Please enter a valid email address.');
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero-section, .services-hero, .contact-hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        heroSections.forEach(section => {
            if (section.offsetTop < window.innerHeight) {
                section.style.transform = `translateY(${rate}px)`;
            }
        });
    });

    // Header hide/show on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(form, message) {
    // Remove existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message mt-2';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    // Insert error message
    form.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(form, message) {
    // Remove existing success messages
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message mt-2';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Insert success message
    form.appendChild(successDiv);
    
    // Remove success after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Mobile menu functionality
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close menu when clicking on links
        navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
}

// Initialize mobile menu
initMobileMenu();

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    // Additional scroll handling if needed
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}