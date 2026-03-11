// Contact page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFeedbackForm();
    initStarRating();
    initFormValidation();
});

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('formSuccess');
    
    // Validate form
    if (!validateContactForm()) {
        return;
    }
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Sending Message...';
    button.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        successMessage.style.display = 'block';
        successMessage.classList.add('fade-in', 'visible');
        
        // Reset form
        form.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 10 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 10000);
        
    }, 2000);
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Validate required fields
    if (!firstName) {
        document.getElementById('firstName').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!lastName) {
        document.getElementById('lastName').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!email || !validateEmail(email)) {
        document.getElementById('email').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        showError(form, 'Please fill in all required fields correctly.');
    }
    
    return isValid;
}

// Feedback form functionality
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitFeedbackForm();
        });
    }
}

function submitFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    const button = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('feedbackSuccess');
    const rating = document.getElementById('rating').value;
    
    // Validate form
    if (!validateFeedbackForm()) {
        return;
    }
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Submitting Feedback...';
    button.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        successMessage.style.display = 'block';
        successMessage.classList.add('fade-in', 'visible');
        
        // Reset form and rating
        form.reset();
        resetStarRating();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 8 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 8000);
        
    }, 1500);
}

function validateFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    const name = document.getElementById('feedbackName').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    const message = document.getElementById('feedbackMessage').value.trim();
    const rating = document.getElementById('rating').value;
    
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Validate required fields
    if (!name) {
        document.getElementById('feedbackName').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!email || !validateEmail(email)) {
        document.getElementById('feedbackEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!message) {
        document.getElementById('feedbackMessage').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!rating || rating == 0) {
        showError(form, 'Please select a rating.');
        isValid = false;
    }
    
    if (!isValid) {
        showError(form, 'Please fill in all required fields and provide a rating.');
    }
    
    return isValid;
}

// Star rating functionality
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            highlightStars(rating);
        });
        
        star.addEventListener('mouseleave', function() {
            const currentRating = ratingInput.value;
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            highlightStars(rating);
            updateRatingText(rating);
        });
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function resetStarRating() {
    document.getElementById('rating').value = 0;
    highlightStars(0);
    updateRatingText(0);
}

function updateRatingText(rating) {
    const ratingTexts = {
        0: 'No rating selected',
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    
    const strengthText = document.getElementById('strengthText');
    if (strengthText) {
        strengthText.textContent = `Rating: ${ratingTexts[rating]}`;
    }
}

// Form validation enhancements
function initFormValidation() {
    // Real-time validation for email fields
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('is-invalid');
                showFieldError(this, 'Please enter a valid email address.');
            } else {
                this.classList.remove('is-invalid');
                hideFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && validateEmail(this.value)) {
                this.classList.remove('is-invalid');
                hideFieldError(this);
            }
        });
    });
    
    // Real-time validation for required fields
    const requiredInputs = document.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
                showFieldError(this, 'This field is required.');
            } else {
                this.classList.remove('is-invalid');
                hideFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
                hideFieldError(this);
            }
        });
    });
}

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger mt-1';
    errorDiv.innerHTML = `<small><i class="fas fa-exclamation-triangle"></i> ${message}</small>`;
    
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Team contact functionality
function initTeamContact() {
    const teamContactLinks = document.querySelectorAll('.team-contact a');
    
    teamContactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.startsWith('mailto:') || this.href.startsWith('tel:')) {
                // Add analytics tracking or other functionality here
                console.log('Team contact clicked:', this.href);
            }
        });
    });
}

// Newsletter form (specific to contact page)
function initContactNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            const button = this.querySelector('button[type="submit"]');
            const successMessage = document.getElementById('newsletterSuccess');
            
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
                    successMessage.style.display = 'block';
                    successMessage.classList.add('fade-in', 'visible');
                    
                    // Reset form
                    this.reset();
                    
                    // Hide after 5 seconds
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 5000);
                }, 1500);
            } else {
                showError(this, 'Please enter a valid email address.');
            }
        });
    }
}

// Initialize additional functionality
initTeamContact();
initContactNewsletter();

// Map functionality (if Google Maps integration is needed)
function initMap() {
    // This would be where Google Maps initialization code would go
    // For now, we're using an embedded iframe
    console.log('Map initialized');
}

// Mobile optimizations for contact page
function initContactMobileOptimizations() {
    if (window.innerWidth <= 768) {
        // Adjust form layout for mobile
        const serviceCheckboxes = document.querySelector('.service-checkboxes');
        if (serviceCheckboxes) {
            serviceCheckboxes.style.gridTemplateColumns = '1fr';
        }
        
        // Optimize team cards for mobile
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            card.style.marginBottom = '2rem';
        });
    }
}

// Initialize mobile optimizations
initContactMobileOptimizations();

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
    
    // Insert error message at the beginning of the form
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Form auto-save functionality (localStorage)
function initFormAutoSave() {
    const forms = ['contactForm', 'feedbackForm'];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            // Load saved data
            loadFormData(form);
            
            // Save data on input
            form.addEventListener('input', function() {
                saveFormData(form);
            });
            
            // Clear saved data on successful submit
            form.addEventListener('submit', function() {
                setTimeout(() => {
                    clearFormData(form);
                }, 3000); // Clear after successful submission
            });
        }
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${form.id}`, JSON.stringify(data));
}

function loadFormData(form) {
    const savedData = localStorage.getItem(`form_${form.id}`);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

function clearFormData(form) {
    localStorage.removeItem(`form_${form.id}`);
}

// Initialize form auto-save
initFormAutoSave();