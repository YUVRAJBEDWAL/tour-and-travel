// Sample event data with actual events and images
const events = [
    {
        id: 1,
        title: 'Summer Music Festival 2024',
        date: '2024-07-15',
        location: 'Central Park',
        category: 'Music',
        image: 'https://source.unsplash.com/random/800x600/?concert',
        description: 'Join us for the biggest music festival of the summer!'
    },
    {
        id: 2,
        title: 'Food & Wine Exhibition',
        date: '2024-06-20',
        location: 'Convention Center',
        category: 'Food',
        image: 'https://source.unsplash.com/random/800x600/?food',
        description: 'Taste exotic cuisines and fine wines from around the world.'
    },
    {
        id: 3,
        title: 'City Marathon 2024',
        date: '2024-08-10',
        location: 'Downtown',
        category: 'Sports',
        image: 'https://source.unsplash.com/random/800x600/?marathon',
        description: 'Annual city marathon with prizes worth $10,000.'
    }
];

// Modal handling
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const closeBtns = document.querySelectorAll('.close');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

loginBtn.onclick = () => loginModal.style.display = 'block';
signupBtn.onclick = () => signupModal.style.display = 'block';

closeBtns.forEach(btn => {
    btn.onclick = function() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }
});

switchToSignup.onclick = (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
}

switchToLogin.onclick = (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
}

// Handle form submissions
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted');
}

document.getElementById('signupForm').onsubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log('Signup submitted');
}

// Function to create event cards
function createEventCard(event) {
    return `
        <div class="event-card">
            <img src="${event.image}" alt="${event.title}">
            <div class="event-info">
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar"></i> ${event.date}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-tag"></i> ${event.category}</p>
                <button class="details-btn">View Details</button>
            </div>
        </div>
    `;
}

// Function to display events
function displayEvents() {
    const eventsGrid = document.querySelector('.events-grid');
    if (eventsGrid) {
        eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
    }
}

// Search functionality
const searchInput = document.querySelector('.search-container input[type="text"]');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEvents = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm) ||
            event.category.toLowerCase().includes(searchTerm)
        );
        
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
            eventsGrid.innerHTML = filteredEvents.map(event => createEventCard(event)).join('');
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayEvents();
});

// Mobile menu toggle
const navLinks = document.querySelector('.nav-links');
const hamburger = document.createElement('div');
hamburger.className = 'hamburger';
hamburger.innerHTML = '<i class="fas fa-bars"></i>';

document.querySelector('.navbar').insertBefore(hamburger, navLinks);

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});