// Import the BookingConfirmation class
const BookingConfirmation = require('./booking-confirmation');

document.addEventListener('DOMContentLoaded', function() {
    const bookingConfirmation = new BookingConfirmation();

    // Initialize all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Handle form submissions
    async function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const bookingType = event.target.getAttribute('data-type');
        const data = Object.fromEntries(formData);
        
        try {
            // Prepare booking details
            const bookingDetails = {
                type: bookingType,
                ...data,
                passengers: parseInt(data.passengers || '1'),
                price: calculatePrice(formData, bookingType)
            };

            // Show payment modal
            const paymentMethod = await showPaymentModal(bookingDetails.price);
            if (!paymentMethod) {
                throw new Error('Payment cancelled');
            }

            // Process booking with payment
            const confirmation = await bookingConfirmation.processBooking(bookingDetails, {
                method: paymentMethod,
                amount: bookingDetails.price
            });

            // Show success confirmation
            showConfirmation(bookingType, confirmation.payment.amount, confirmation.confirmationId);
        } catch (error) {
            console.error('Booking error:', error);
            alert('Sorry, there was an error processing your booking: ' + error.message);
        }
    }

    // Calculate price based on booking type and parameters
    function calculatePrice(formData, bookingType) {
        let basePrice = 0;
        switch(bookingType) {
            case 'hotel':
                const nights = getDaysDifference(formData.get('check-in'), formData.get('check-out'));
                const rooms = parseInt(formData.get('rooms'));
                basePrice = nights * rooms * 100; // $100 per room per night
                break;
            case 'flight':
                basePrice = 200; // Base flight price
                break;
            case 'train':
                basePrice = 50; // Base train price
                break;
            case 'bus':
                basePrice = 30; // Base bus price
                break;
            case 'car':
                const rentalDays = getDaysDifference(formData.get('pickup-date'), formData.get('return-date'));
                basePrice = rentalDays * 50; // $50 per day
                break;
            case 'taxi':
                basePrice = 25; // Base taxi price
                break;
        }
        return basePrice;
    }

    function getDaysDifference(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
});

function showConfirmation(type, price, bookingId) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Booking Confirmed!</h3>
            <p>Your ${type} booking has been confirmed.</p>
            <p>Total Price: $${price}</p>
            <p>Booking ID: ${bookingId}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add search results display
function displayResults(results, type) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.innerHTML = `
        <h3>${type} Search Results</h3>
        <div class="results-grid">
            ${results.map(result => `
                <div class="result-card">
                    <h4>${result.name || result.airline}</h4>
                    <p>Price: $${result.price}</p>
                    <button onclick="selectOption('${type}', ${JSON.stringify(result)})">Select</button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add to page
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    document.querySelector('.container').appendChild(resultsContainer);
}