// Authentication page functionality

document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initRegisterForm();
    initPasswordToggle();
    initPasswordStrength();
    initSocialLogin();
});

// Login form functionality
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const button = document.querySelector('#loginForm button[type="submit"]');
    
    // Validate inputs
    if (!validateLoginForm()) {
        return;
    }
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Signing In...';
    button.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Store user data if remember me is checked
        if (rememberMe) {
            localStorage.setItem('rememberUser', email);
        }
        
        // Simulate successful login
        showSuccess(document.getElementById('loginForm'), 'Login successful! Redirecting...');
        
        // Redirect to dashboard or home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    }, 2000);
}

function validateLoginForm() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const form = document.getElementById('loginForm');
    
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    if (!email || !validateEmail(email)) {
        document.getElementById('loginEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!password || password.length < 6) {
        document.getElementById('loginPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        showError(form, 'Please enter valid email and password.');
    }
    
    return isValid;
}

// Register form functionality
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
}

function handleRegister() {
    const form = document.getElementById('registerForm');
    const button = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateRegisterForm()) {
        return;
    }
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Creating Account...';
    button.disabled = true;
    
    // Simulate registration process
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        showSuccess(form, 'Account created successfully! Redirecting to login...');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    }, 2500);
}

function validateRegisterForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const propertyType = document.getElementById('propertyType').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const form = document.getElementById('registerForm');
    
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
        document.getElementById('registerEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!phone) {
        document.getElementById('phone').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!password || !validatePassword(password)) {
        document.getElementById('registerPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        showError(form, 'Passwords do not match.');
        isValid = false;
    }
    
    if (!propertyType) {
        document.getElementById('propertyType').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!agreeTerms) {
        showError(form, 'You must agree to the Terms of Service and Privacy Policy.');
        isValid = false;
    }
    
    if (!isValid && !form.querySelector('.error-message')) {
        showError(form, 'Please fill in all required fields correctly.');
    }
    
    return isValid;
}

// Password toggle functionality
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('#togglePassword, #toggleRegPassword');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id === 'togglePassword' ? 'loginPassword' : 'registerPassword';
            const passwordField = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Password strength indicator
function initPasswordStrength() {
    const passwordField = document.getElementById('registerPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            checkPasswordMatch();
        });
        
        passwordField.addEventListener('input', function() {
            if (confirmPasswordField.value) {
                checkPasswordMatch();
            }
        });
    }
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    const strength = calculatePasswordStrength(password);
    
    // Remove all strength classes
    strengthBar.className = 'strength-bar';
    
    // Add appropriate strength class
    if (strength.score === 0) {
        strengthText.textContent = 'Password strength: Too weak';
    } else if (strength.score === 1) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Password strength: Weak';
        strengthText.style.color = '#dc3545';
    } else if (strength.score === 2) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Password strength: Fair';
        strengthText.style.color = '#ffc107';
    } else if (strength.score === 3) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Password strength: Good';
        strengthText.style.color = '#17a2b8';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Password strength: Strong';
        strengthText.style.color = '#28a745';
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= 8) score++;
    else feedback.push('Use at least 8 characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');
    
    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Add numbers');
    
    // Special character check
    if (/[^a-zA-Z\d]/.test(password)) score++;
    else feedback.push('Add special characters');
    
    // Bonus for length
    if (password.length >= 12) score++;
    
    return {
        score: Math.min(score, 4),
        feedback: feedback
    };
}

function checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmField = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmField.classList.add('is-invalid');
        showFieldError(confirmField, 'Passwords do not match');
    } else if (confirmPassword) {
        confirmField.classList.remove('is-invalid');
        hideFieldError(confirmField);
    }
}

function validatePassword(password) {
    const strength = calculatePasswordStrength(password);
    return strength.score >= 2; // Require at least "fair" strength
}

// Social login functionality
function initSocialLogin() {
    const socialButtons = document.querySelectorAll('.btn-social');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading"></span> Connecting...';
            this.disabled = true;
            
            // Simulate social login
            setTimeout(() => {
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show message (in real app, this would redirect to OAuth)
                alert(`${provider} login would be implemented here. This is a demo.`);
            }, 2000);
        });
    });
}

// Form auto-fill for returning users
function initAutoFill() {
    const rememberedUser = localStorage.getItem('rememberUser');
    const emailField = document.getElementById('loginEmail');
    
    if (rememberedUser && emailField) {
        emailField.value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
}

// Initialize auto-fill
initAutoFill();

// Form validation helpers
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
    
    // Insert error message at the top of the form
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(form, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message mt-2';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Insert success message at the top of the form
    form.insertBefore(successDiv, form.firstChild);
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

// Real-time form validation
function initRealTimeValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('is-invalid');
                showFieldError(this, 'Please enter a valid email address');
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
    
    // Required field validation
    const requiredInputs = document.querySelectorAll('input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
                showFieldError(this, 'This field is required');
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

// Initialize real-time validation
initRealTimeValidation();

// Phone number formatting
function initPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            
            this.value = value;
        });
    }
}

// Initialize phone formatting
initPhoneFormatting();