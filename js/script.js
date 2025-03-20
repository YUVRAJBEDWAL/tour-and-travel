let navbar = document.querySelector('.header .navbar');
document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.add('active');
}
document.querySelector('#nav-close').onclick = () =>{
    navbar.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.add('active');
}

document.querySelector('#close-search').onclick = () =>{
    searchForm.classList.remove('active');
}
window.onscroll=()=>{
    navbar.classList.remove('active');
    if(window.scrollY>0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};
window.onload=()=>{
    if(window.scrollY>0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};

// Booking form handler
document.addEventListener('DOMContentLoaded', function() {
    const bookingForms = document.querySelectorAll('form[action^="/api/book"]');
    
    // Date picker initialization with availability checking
    const datePicker = document.querySelector('input[type="date"]');
    if (datePicker) {
        datePicker.min = new Date().toISOString().split('T')[0];
        datePicker.addEventListener('change', async function() {
            const date = this.value;
            try {
                const response = await fetch(`/api/availability/check?date=${date}`);
                const data = await response.json();
                if (!data.available) {
                    showError('Selected date is not available. Please choose another date.');
                    this.value = '';
                }
            } catch (error) {
                console.error('Availability check failed:', error);
            }
        });
    }

    // Form validation and submission
    bookingForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            setLoadingState(submitBtn, true);

            try {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // First, initialize payment
                const paymentResponse = await initializePayment(data.package);
                if (!paymentResponse.success) {
                    throw new Error('Payment initialization failed');
                }

                // Process the booking
                const response = await fetch('/api/book/bungee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...data,
                        paymentId: paymentResponse.paymentId
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    showBookingConfirmation(result.bookingId, result.price);
                    form.reset();
                } else {
                    showError(result.message || 'Booking failed. Please try again.');
                }
            } catch (error) {
                showError('An error occurred during booking. Please try again.');
                console.error('Booking error:', error);
            } finally {
                setLoadingState(submitBtn, false);
            }
        });
    });
});

// Form validation function
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(`Please fill in ${field.name || 'all required fields'}`);
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }

        // Email validation
        if (field.type === 'email' && !validateEmail(field.value)) {
            showError('Please enter a valid email address');
            field.classList.add('error');
            isValid = false;
        }

        // Phone validation
        if (field.name === 'phone' && !validatePhone(field.value)) {
            showError('Please enter a valid phone number');
            field.classList.add('error');
            isValid = false;
        }
    });

    return isValid;
}

// Payment gateway integration
async function initializePayment(packageType) {
    try {
        const response = await fetch('/api/payment/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ packageType })
        });
        return await response.json();
    } catch (error) {
        showError('Payment initialization failed');
        return { success: false };
    }
}

// Utility functions
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = 'Book Now';
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}

// Add these styles to the existing styles
styles.textContent += `
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    .error {
        border-color: #ff4444 !important;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

// Booking confirmation modal
function showBookingConfirmation(bookingId, price) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Booking Confirmed!</h3>
            <p>Your booking has been confirmed.</p>
            <p>Booking ID: ${bookingId}</p>
            <p>Total Price: ₹${price}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add modal styles
const styles = document.createElement('style');
styles.textContent = `
    .booking-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        width: 90%;
    }

    .modal-content h3 {
        color: #219150;
        margin-bottom: 15px;
    }

    .modal-content button {
        background: #219150;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
    }

    .modal-content button:hover {
        background: #1a7340;
    }
`;
document.head.appendChild(styles);

