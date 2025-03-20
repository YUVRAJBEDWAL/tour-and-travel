document.addEventListener('DOMContentLoaded', function() {
    // Tab switching in search box
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchFormElements = document.querySelectorAll('.search-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            searchFormElements.forEach(form => form.classList.remove('active'));

            // Add active class to clicked tab
            button.classList.add('active');
            
            // Show the corresponding form
            const formId = `${button.dataset.tab}-search`;
            document.getElementById(formId)?.classList.add('active');
        });
    });

    // Set default dates for search forms
    const setDefaultDates = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        // Set check-in and check-out dates
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');
        
        if (checkInInput) checkInInput.value = formatDate(today);
        if (checkOutInput) checkOutInput.value = formatDate(nextWeek);
    };
    
    setDefaultDates();

    // Handle form submissions
    const formElements = document.querySelectorAll('.search-form');
    formElements.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formId = form.id;
            let searchParams = new URLSearchParams();

            switch(formId) {
                case 'hotels-search':
                    searchParams.append('destination', document.getElementById('destination-hotel').value);
                    searchParams.append('checkIn', document.getElementById('check-in').value);
                    searchParams.append('checkOut', document.getElementById('check-out').value);
                    searchParams.append('guests', document.getElementById('guests').value);
                    searchParams.append('rooms', document.getElementById('rooms').value);
                    window.location.href = `hotels.html?${searchParams.toString()}`;
                    break;

                case 'flights-search':
                    searchParams.append('from', document.getElementById('from').value);
                    searchParams.append('to', document.getElementById('to').value);
                    searchParams.append('departureDate', document.getElementById('departure-date').value);
                    searchParams.append('returnDate', document.getElementById('return-date').value);
                    searchParams.append('travelers', document.getElementById('travelers').value);
                    searchParams.append('cabinClass', document.getElementById('cabin-class').value);
                    window.location.href = `flights.html?${searchParams.toString()}`;
                    break;

                case 'transport-search':
                    searchParams.append('from', document.getElementById('transport-from').value);
                    searchParams.append('to', document.getElementById('transport-to').value);
                    searchParams.append('date', document.getElementById('transport-date').value);
                    searchParams.append('type', document.getElementById('transport-type').value);
                    searchParams.append('passengers', document.getElementById('transport-passengers').value);
                    searchParams.append('class', document.getElementById('transport-class').value);
                    window.location.href = `transport.html?${searchParams.toString()}`;
                    break;

                case 'rentals-search':
                    searchParams.append('pickup', document.getElementById('pickup-location').value);
                    searchParams.append('dropoff', document.getElementById('dropoff-location').value);
                    searchParams.append('pickupDate', document.getElementById('pickup-date').value);
                    searchParams.append('pickupTime', document.getElementById('pickup-time').value);
                    searchParams.append('dropoffDate', document.getElementById('dropoff-date').value);
                    searchParams.append('dropoffTime', document.getElementById('dropoff-time').value);
                    window.location.href = `rentals.html?${searchParams.toString()}`;
                    break;
            }
        });
    });
});

// Flight filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const priceSlider = document.querySelector('.price-slider');
    const airlineCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const flightResults = document.getElementById('flights-results');
    
    // Update flights based on filters
    function getTimeSlot(time) {
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 6 && hour < 12) return 'Morning';
        if (hour >= 12 && hour < 18) return 'Afternoon';
        if (hour >= 18 && hour < 24) return 'Evening';
        return 'Night';
    }
    
    function updateFlights() {
        const selectedAirlines = Array.from(document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.parentElement.textContent.trim());
        
        const selectedTimes = Array.from(document.querySelectorAll('.filter-group:nth-child(3) input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.parentElement.textContent.trim());
        
        const maxPrice = parseInt(document.querySelector('.price-slider').value);
        
        const flightCards = document.querySelectorAll('.flight-card');
        
        flightCards.forEach(card => {
            const airline = card.querySelector('.airline-info span').textContent;
            const price = parseInt(card.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
            const departureTime = card.querySelector('.departure h3').textContent;
            const timeSlot = getTimeSlot(departureTime);
            
            const matchesAirline = selectedAirlines.length === 0 || 
                                 selectedAirlines.some(selected => airline.includes(selected));
            const matchesPrice = price <= maxPrice;
            const matchesTime = selectedTimes.length === 0 || 
                              selectedTimes.some(selected => selected.includes(timeSlot));
            
            card.style.display = (matchesAirline && matchesPrice && matchesTime) ? 'flex' : 'none';
        });
    }
    
    // Add event listeners to filters
    priceSlider.addEventListener('input', updateFlights);
    airlineCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFlights);
    });
    
    // Initialize with all flights visible
    updateFlights();
});

// Car rental listings
document.addEventListener('DOMContentLoaded', function() {
    const rentalsResults = document.getElementById('rentals-results');
    if (rentalsResults) {
        const carListings = [
            {
                type: 'Economy',
                name: 'Hyundai i10',
                image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3',
                seats: 5,
                transmission: 'Manual',
                mileage: 'Unlimited',
                price: 1499
            },
            {
                type: 'Compact',
                name: 'Honda City',
                image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3',
                seats: 5,
                transmission: 'Automatic',
                mileage: 'Unlimited',
                price: 2499
            },
            {
                type: 'SUV',
                name: 'Hyundai Creta',
                image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-4.0.3',
                seats: 7,
                transmission: 'Automatic',
                mileage: 'Unlimited',
                price: 3499
            },
            {
                type: 'Luxury',
                name: 'Mercedes-Benz C-Class',
                image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3',
                seats: 5,
                transmission: 'Automatic',
                mileage: 'Unlimited',
                price: 7999
            }
        ];

        const carsHTML = carListings.map(car => `
            <div class="car-card">
                <img src="${car.image}" alt="${car.name}" class="car-image">
                <div class="car-details">
                    <div class="car-type">${car.name}</div>
                    <p class="car-category">${car.type}</p>
                    <div class="car-features">
                        <div class="feature">
                            <i class="fas fa-users"></i>
                            <span>${car.seats} Seats</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-cog"></i>
                            <span>${car.transmission}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-road"></i>
                            <span>${car.mileage} Mileage</span>
                        </div>
                    </div>
                    <div class="rental-price">
                        <div class="price-amount">₹${car.price}<small>/day</small></div>
                        <button class="btn btn-primary">Book Now</button>
                    </div>
                </div>
            </div>
        `).join('');

        rentalsResults.innerHTML = carsHTML;
    }
});