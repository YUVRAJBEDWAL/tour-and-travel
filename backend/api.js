const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;  // Keep only this PORT definition

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Skyscanner Flight Search
// Add environment variables for API keys
const RAPIDAPI_KEY = '67ccaca0e64e7fb47cbd9433';

// Update the flight search endpoint
app.get('/api/flights', async (req, res) => {
    try {
        const response = await axios.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
            },
            params: {
                originplace: `${req.query.from}-sky`,
                destinationplace: `${req.query.to}-sky`,
                outboundpartialdate: req.query.date
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            message: 'Flight search failed'
        });
    }
});

// Add train search endpoint
app.get('/api/trains', async (req, res) => {
    try {
        const response = await axios.get('https://irctc1.p.rapidapi.com/api/v2/trainBetweenStations', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
            },
            params: {
                fromStationCode: req.query.from,
                toStationCode: req.query.to,
                dateOfJourney: req.query.date
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add bus search endpoint
app.get('/api/buses', async (req, res) => {
    try {
        const response = await axios.get('https://redbus.p.rapidapi.com/bus/search', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'redbus.p.rapidapi.com'
            },
            params: {
                source: req.query.from,
                destination: req.query.to,
                date: req.query.date
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Booking.com Hotels
app.get('/api/hotels', async (req, res) => {
    try {
        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
            headers: {
                'X-RapidAPI-Key': '67ccaca0e64e7fb47cbd9433',
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            },
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Price calculation functions
const calculateHotelPrice = (nights, rooms) => rooms * nights * 100;
const calculateFlightPrice = (from, to) => 200 + Math.random() * 300;
const calculateTrainPrice = () => 50 + Math.random() * 50;
const calculateBusPrice = () => 30 + Math.random() * 20;
const calculateCarRentalPrice = (days) => days * 50;
const calculateTaxiPrice = () => 25 + Math.random() * 15;

// Booking storage (in-memory database)
const bookings = [];

app.post('/api/book/:type', (req, res) => {
    const { type } = req.params;
    const booking = req.body;
    let price = 0;

    try {
        switch(type) {
            case 'hotel':
                const nights = getDaysDifference(booking['check-in'], booking['check-out']);
                price = calculateHotelPrice(nights, parseInt(booking.rooms));
                break;
            case 'flight':
                price = calculateFlightPrice(booking['flight-from'], booking['flight-to']);
                break;
            case 'train':
                price = calculateTrainPrice();
                break;
            case 'bus':
                price = calculateBusPrice();
                break;
            case 'car':
                const rentalDays = getDaysDifference(booking['pickup-date'], booking['return-date']);
                price = calculateCarRentalPrice(rentalDays);
                break;
            case 'taxi':
                price = calculateTaxiPrice();
                break;
            default:
                throw new Error('Invalid booking type');
        }

        const bookingId = generateBookingId();
        const newBooking = {
            id: bookingId,
            type,
            details: booking,
            price: Math.round(price),
            date: new Date()
        };

        bookings.push(newBooking);

        res.json({
            success: true,
            price: Math.round(price),
            bookingId
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

function getDaysDifference(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

function generateBookingId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Remove the duplicate PORT definition and keep only one at the top
const PORT = process.env.PORT || 3001;

// Add proper MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful DB connection
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
        console.error('Server error:', err);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Remove the duplicate app.listen and keep only one at the bottom
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});

// Mock data for testing
const mockFlights = [
    {
        id: "F1",
        airline: "IndiGo",
        from: "Delhi",
        to: "Mumbai",
        departure: "10:00 AM",
        arrival: "12:00 PM",
        price: 5999,
        duration: "2h"
    },
    {
        id: "F2",
        airline: "Air India",
        from: "Mumbai",
        to: "Bangalore",
        departure: "2:00 PM",
        arrival: "4:00 PM",
        price: 4999,
        duration: "2h"
    }
];

const mockBuses = [
    {
        id: "B1",
        operator: "RedBus",
        from: "Delhi",
        to: "Jaipur",
        departure: "9:00 PM",
        arrival: "6:00 AM",
        price: 800,
        type: "AC Sleeper"
    },
    {
        id: "B2",
        operator: "BlueBus",
        from: "Mumbai",
        to: "Pune",
        departure: "10:00 PM",
        arrival: "4:00 AM",
        price: 600,
        type: "AC Seater"
    }
];

// Replace the API endpoints with mock data
app.get('/api/flights', (req, res) => {
    const { from, to } = req.query;
    const filteredFlights = mockFlights.filter(flight => 
        (!from || flight.from.toLowerCase().includes(from.toLowerCase())) &&
        (!to || flight.to.toLowerCase().includes(to.toLowerCase()))
    );
    res.json({
        success: true,
        data: filteredFlights
    });
});

app.get('/api/buses', (req, res) => {
    const { from, to } = req.query;
    const filteredBuses = mockBuses.filter(bus => 
        (!from || bus.from.toLowerCase().includes(from.toLowerCase())) &&
        (!to || bus.to.toLowerCase().includes(to.toLowerCase()))
    );
    res.json({
        success: true,
        data: filteredBuses
    });
});