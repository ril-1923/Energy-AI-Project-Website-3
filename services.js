// Services page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initROICalculator();
    initServiceModals();
    initTestimonialCarousel();
});

// ROI Calculator functionality
function initROICalculator() {
    const roiForm = document.getElementById('roiForm');
    const roiResult = document.getElementById('roiResult');
    
    if (roiForm) {
        roiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateROI();
        });
    }
}

function calculateROI() {
    // Get input values
    const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
    const systemSize = parseFloat(document.getElementById('systemSize').value);
    const installCost = parseFloat(document.getElementById('installCost').value);
    const taxCredit = parseFloat(document.getElementById('taxCredit').value);
    
    // Validate inputs
    if (!monthlyBill || !systemSize || !installCost) {
        showError(document.getElementById('roiForm'), 'Please fill in all required fields.');
        return;
    }
    
    // Calculate savings and payback
    const annualBill = monthlyBill * 12;
    const systemProduction = systemSize * 1400; // kWh per year (average)
    const electricityRate = annualBill / (monthlyBill * 12 * 30); // rough estimate
    const annualSavings = systemProduction * 0.12; // $0.12 per kWh average
    const netCost = installCost - (installCost * (taxCredit / 100));
    const paybackYears = netCost / annualSavings;
    const totalSavings = (annualSavings * 25) - netCost;
    
    // Show loading animation
    const button = document.querySelector('.btn-calculator');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Calculating...';
    button.disabled = true;
    
    // Simulate calculation delay
    setTimeout(() => {
        // Display results
        document.getElementById('annualSavings').textContent = `$${Math.round(annualSavings).toLocaleString()}`;
        document.getElementById('paybackPeriod').textContent = `${paybackYears.toFixed(1)} years`;
        document.getElementById('totalSavings').textContent = `$${Math.round(totalSavings).toLocaleString()}`;
        
        // Show results with animation
        const roiResult = document.getElementById('roiResult');
        roiResult.style.display = 'block';
        roiResult.classList.add('fade-in', 'visible');
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Scroll to results
        roiResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
}

// Service modals functionality
function initServiceModals() {
    // Add modal functionality for services that don't have modals yet
    const serviceButtons = document.querySelectorAll('.btn-service-details');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = document.querySelector(this.getAttribute('data-bs-target'));
            if (!modal) {
                // Create dynamic modal content for services without predefined modals
                createServiceModal(this);
            }
        });
    });
}

function createServiceModal(button) {
    const serviceCard = button.closest('.service-card');
    const serviceName = serviceCard.querySelector('h4').textContent;
    const serviceDescription = serviceCard.querySelector('p').textContent;
    const serviceFeatures = Array.from(serviceCard.querySelectorAll('.service-features li')).map(li => li.textContent);
    
    // Create modal HTML
    const modalId = serviceName.toLowerCase().replace(/\s+/g, '') + 'Modal';
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${serviceName}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${serviceDescription}</p>
                        <h6>Key Features:</h6>
                        <ul>
                            ${serviceFeatures.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <div class="mt-4">
                            <h6>Get Started:</h6>
                            <p>Contact us today for a free consultation and personalized quote for ${serviceName.toLowerCase()}.</p>
                            <a href="contact.html" class="btn btn-service-details">Request Quote</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Update button to target the new modal
    button.setAttribute('data-bs-target', `#${modalId}`);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

// Testimonial carousel functionality
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    
    if (carousel) {
        // Auto-play carousel
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            ride: 'carousel'
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', function() {
            bsCarousel.pause();
        });
        
        carousel.addEventListener('mouseleave', function() {
            bsCarousel.cycle();
        });
    }
}

// Service card animations
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize service card animations
initServiceCardAnimations();

// Form validation for ROI calculator
function validateROIForm() {
    const form = document.getElementById('roiForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        
        if (!value || value <= 0) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
        
        // Add real-time validation
        input.addEventListener('input', function() {
            const val = parseFloat(this.value);
            if (val && val > 0) {
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
            }
        });
    });
    
    return isValid;
}

// Add CSS for validation styles
const style = document.createElement('style');
style.textContent = `
    .is-invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .service-card {
        transition: all 0.3s ease;
    }
    
    .roi-result {
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Mobile optimizations for services page
function initMobileOptimizations() {
    if (window.innerWidth <= 768) {
        // Simplify carousel controls for mobile
        const carouselControls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
        carouselControls.forEach(control => {
            control.style.display = 'none';
        });
        
        // Add swipe indicators
        const carousel = document.getElementById('testimonialCarousel');
        if (carousel) {
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            indicators.innerHTML = `
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2"></button>
            `;
            carousel.appendChild(indicators);
        }
    }
}

// Initialize mobile optimizations
initMobileOptimizations();

// Recalculate on window resize
window.addEventListener('resize', debounce(function() {
    initMobileOptimizations();
}, 250));

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}