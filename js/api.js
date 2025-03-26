// Travel API Service
class TravelAPI {
    constructor() {
        this.baseUrl = '/api';
        this.endpoints = {
            packages: '/packages',
            bookings: '/bookings',
            users: '/users',
            auth: '/auth'
        };
    }

    // Get all travel packages
    async getPackages() {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.packages}`);
            if (!response.ok) {
                throw new Error('Failed to fetch packages');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching packages:', error);
            return [];
        }
    }

    // Get package by ID
    async getPackageById(id) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.packages}/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch package with ID: ${id}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching package ${id}:`, error);
            return null;
        }
    }

    // Create a new booking
    async createBooking(bookingData) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.bookings}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create booking');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }

    // Get user bookings
    async getUserBookings(userId) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.users}/${userId}/bookings`);
            if (!response.ok) {
                throw new Error('Failed to fetch user bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            return [];
        }
    }

    // Mock API for development
    mockPackages() {
        return [
            {
                id: 1,
                name: 'Manali Package',
                description: 'Experience the beauty of Manali with our comprehensive tour package.',
                price: 5999,
                duration: '5 days, 4 nights',
                image: 'images/img-1.jpg',
                rating: 4.5
            },
            {
                id: 2,
                name: 'Goa Package',
                description: 'Enjoy the beaches and nightlife of Goa with our exclusive package.',
                price: 7999,
                duration: '4 days, 3 nights',
                image: 'images/img-2.jpg',
                rating: 4.7
            },
            {
                id: 3,
                name: 'Delhi Package',
                description: 'Explore the historical monuments and culture of Delhi.',
                price: 2999,
                duration: '3 days, 2 nights',
                image: 'images/img-3.jpg',
                rating: 4.2
            }
        ];
    }
}

// Export the API service
const travelAPI = new TravelAPI();