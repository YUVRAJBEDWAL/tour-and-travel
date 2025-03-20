const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// RapidAPI Key for all services
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '67ccaca0e64e7fb47cbd9433';

// Flight search endpoint using Skyscanner API
router.post('/search/flights', async (req, res) => {
    try {
        const { from, to, date, passengers } = req.body;
        const response = await axios.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
            },
            params: {
                originplace: `${from}-sky`,
                destinationplace: `${to}-sky`,
                outboundpartialdate: date,
                adults: passengers
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search flights' });
    }
});

// Hotel search endpoint using Booking.com API
router.post('/search/hotels', async (req, res) => {
    try {
        const { destination, checkin, checkout, guests } = req.body;
        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            },
            params: {
                dest_id: destination,
                checkin_date: checkin,
                checkout_date: checkout,
                adults_number: guests,
                room_number: '1',
                locale: 'en-us'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search hotels' });
    }
});

// Train search endpoint using IRCTC API
router.post('/search/trains', async (req, res) => {
    try {
        const { from, to, date } = req.body;
        const response = await axios.get('https://irctc1.p.rapidapi.com/api/v2/trainBetweenStations', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
            },
            params: {
                fromStationCode: from,
                toStationCode: to,
                dateOfJourney: date
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search trains' });
    }
});

// Bus search endpoint using Redbus API
router.post('/search/buses', async (req, res) => {
    try {
        const { from, to, date } = req.body;
        const response = await axios.get('https://redbus.p.rapidapi.com/bus/search', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'redbus.p.rapidapi.com'
            },
            params: {
                source: from,
                destination: to,
                date: date
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search buses' });
    }
});

// Booking confirmation endpoint
router.post('/booking/confirm', async (req, res) => {
    try {
        const { bookingType, bookingDetails, paymentInfo } = req.body;
        
        // Validate booking details
        if (!bookingType || !bookingDetails || !paymentInfo) {
            throw new Error('Missing required booking information');
        }

        // Process booking based on type
        let bookingResponse;
        switch(bookingType) {
            case 'flight':
                bookingResponse = await processFlightBooking(bookingDetails);
                break;
            case 'hotel':
                bookingResponse = await processHotelBooking(bookingDetails);
                break;
            case 'train':
                bookingResponse = await processTrainBooking(bookingDetails);
                break;
            case 'bus':
                bookingResponse = await processBusBooking(bookingDetails);
                break;
            default:
                throw new Error('Invalid booking type');
        }

        // Generate booking confirmation
        const confirmation = {
            bookingId: generateBookingId(),
            status: 'confirmed',
            details: bookingResponse,
            timestamp: new Date().toISOString()
        };
        
        res.json(confirmation);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Booking confirmation failed' });
    }
});

// Helper functions for processing bookings
async function processFlightBooking(details) {
    // Implement flight booking logic
    return { type: 'flight', ...details };
}

async function processHotelBooking(details) {
    // Implement hotel booking logic
    return { type: 'hotel', ...details };
}

async function processTrainBooking(details) {
    // Implement train booking logic
    return { type: 'train', ...details };
}

async function processBusBooking(details) {
    // Implement bus booking logic
    return { type: 'bus', ...details };
}

// Helper function to generate booking ID
function generateBookingId() {
    return 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;