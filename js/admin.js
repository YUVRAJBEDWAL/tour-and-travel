/**
 * Admin Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initCharts();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize sidebar navigation
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('#sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

/**
 * Load dashboard data from API
 */
function loadDashboardData() {
    // Fetch dashboard data from API
    fetch('api.php?endpoint=dashboard')
        .then(response => response.json())
        .then(dashboardData => {
            // If API call fails, use default data
            if (!dashboardData) {
                dashboardData = {
                    totalBookings: 0,
                    totalUsers: 0,
                    totalRevenue: 0,
                    pendingBookings: 0,
                    recentBookings: []
                };
            }
    
    // Update dashboard stats
    document.getElementById('total-bookings').textContent = dashboardData.totalBookings;
    document.getElementById('total-users').textContent = dashboardData.totalUsers;
    document.getElementById('total-revenue').textContent = '$' + dashboardData.totalRevenue;
    document.getElementById('pending-bookings').textContent = dashboardData.pendingBookings;
    
    // Populate recent bookings table
    const tableBody = document.querySelector('#recent-bookings-table tbody');
    tableBody.innerHTML = '';
    
    dashboardData.recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Create status badge with appropriate color
        let statusClass = '';
        switch(booking.status) {
            case 'Confirmed':
                statusClass = 'bg-success';
                break;
            case 'Pending':
                statusClass = 'bg-warning';
                break;
            case 'Cancelled':
                statusClass = 'bg-danger';
                break;
            default:
                statusClass = 'bg-secondary';
        }
        
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.package}</td>
            <td>${booking.date}</td>
            <td><span class="badge ${statusClass}">${booking.status}</span></td>
            <td>$${booking.amount}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary me-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Load bookings data
    loadBookingsData();
    
    // Load users data
    loadUsersData();
    
    // Load packages data
    loadPackagesData();
    
    // Load analytics data
    loadAnalyticsData();
}

/**
 * Load bookings data
 */
function loadBookingsData() {
    // Fetch bookings data from API
    fetch('api.php?endpoint=bookings')
        .then(response => response.json())
        .then(bookingsData => {
            // If API call fails, use empty array
            if (!bookingsData) {
                bookingsData = [];
            }
    
    // Populate bookings table
    const tableBody = document.querySelector('#bookings-table tbody');
    tableBody.innerHTML = '';
    
    bookingsData.forEach(booking => {
        const row = document.createElement('tr');
        
        // Create status badge with appropriate color
        let statusClass = '';
        switch(booking.status) {
            case 'Confirmed':
                statusClass = 'bg-success';
                break;
            case 'Pending':
                statusClass = 'bg-warning';
                break;
            case 'Cancelled':
                statusClass = 'bg-danger';
                break;
            default:
                statusClass = 'bg-secondary';
        }
        
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.package}</td>
            <td>${booking.bookingDate}</td>
            <td>${booking.travelDate}</td>
            <td><span class="badge ${statusClass}">${booking.status}</span></td>
            <td>$${booking.amount}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-eye me-2"></i>View Details</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-edit me-2"></i>Edit Booking</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-check-circle me-2"></i>Confirm Booking</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-times-circle me-2"></i>Cancel Booking</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#"><i class="fas fa-trash me-2"></i>Delete</a></li>
                    </ul>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Load users data
 */
function loadUsersData() {
    // Fetch users data from API
    fetch('api.php?endpoint=users')
        .then(response => response.json())
        .then(usersData => {
            // If API call fails, use empty array
            if (!usersData) {
                usersData = [];
            }
    
    // Populate users table
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    usersData.forEach(user => {
        const row = document.createElement('tr');
        
        // Create status badge with appropriate color
        let statusClass = user.status === 'Active' ? 'bg-success' : 'bg-danger';
        let roleClass = '';
        
        switch(user.role) {
            case 'Admin':
                roleClass = 'bg-danger';
                break;
            case 'Manager':
                roleClass = 'bg-warning';
                break;
            default:
                roleClass = 'bg-info';
        }
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge ${roleClass}">${user.role}</span></td>
            <td>${user.joinedDate}</td>
            <td><span class="badge ${statusClass}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary me-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listener for save user button
    document.getElementById('saveUserBtn').addEventListener('click', function() {
        // In a real application, this would send data to the server
        alert('User saved successfully!');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('addUserForm').reset();
    });
}

/**
 * Load packages data
 */
function loadPackagesData() {
    // Fetch packages data from API
    fetch('api.php?endpoint=packages')
        .then(response => response.json())
        .then(packagesData => {
            // If API call fails, use empty array
            if (!packagesData) {
                packagesData = [];
            }
    
    // Populate packages container
    const packagesContainer = document.getElementById('packages-container');
    packagesContainer.innerHTML = '';
    
    packagesData.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'col-md-4 mb-4';
        
        packageCard.innerHTML = `
            <div class="card package-card h-100">
                <img src="${pkg.image}" class="card-img-top" alt="${pkg.name}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${pkg.name}</h5>
                        <span class="badge bg-primary">$${pkg.price}</span>
                    </div>
                    <p class="card-text">${pkg.description}</p>
                    <div class="d-flex justify-content-between">
                        <span><i class="fas fa-map-marker-alt me-1"></i>${pkg.location}</span>
                        <span><i class="fas fa-clock me-1"></i>${pkg.duration} days</span>
                    </div>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit me-1"></i>Edit</button>
                    <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash me-1"></i>Delete</button>
                </div>
            </div>
        `;
        
        packagesContainer.appendChild(packageCard);
    });
    
    // Add event listener for save package button
    document.getElementById('savePackageBtn').addEventListener('click', function() {
        // In a real application, this would send data to the server
        alert('Package saved successfully!');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPackageModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('addPackageForm').reset();
    });
}

/**
 * Load analytics data
 */
function loadAnalyticsData() {
    // Simulated destinations data
    const destinationsData = [
        { destination: 'Bali, Indonesia', bookings: 156, revenue: 187200, rating: 4.8, trend: 'up' },
        { destination: 'Paris, France', bookings: 132, revenue: 237600, rating: 4.7, trend: 'up' },
        { destination: 'Tokyo, Japan', bookings: 98, revenue: 215600, rating: 4.9, trend: 'up' },
        { destination: 'New York, USA', bookings: 87, revenue: 130500, rating: 4.5, trend: 'down' },
        { destination: 'Rome, Italy', bookings: 76, revenue: 144400, rating: 4.6, trend: 'up' }
    ];
    
    // Populate destinations table
    const tableBody = document.querySelector('#destinations-table tbody');
    tableBody.innerHTML = '';
    
    destinationsData.forEach(dest => {
        const row = document.createElement('tr');
        
        // Create trend icon with appropriate color
        let trendIcon = dest.trend === 'up' ? 
            '<i class="fas fa-arrow-up text-success"></i>' : 
            '<i class="fas fa-arrow-down text-danger"></i>';
        
        row.innerHTML = `
            <td>${dest.destination}</td>
            <td>${dest.bookings}</td>
            <td>$${dest.revenue.toLocaleString()}</td>
            <td>
                <div class="d-flex align-items-center">
                    ${dest.rating}
                    <div class="ms-2">
                        ${'★'.repeat(Math.floor(dest.rating))}
                        ${dest.rating % 1 >= 0.5 ? '½' : ''}
                    </div>
                </div>
            </td>
            <td>${trendIcon}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Initialize charts
 */
function initCharts() {
    // Bookings Chart
    const bookingsChartCtx = document.getElementById('bookingsChart').getContext('2d');
    const bookingsChart = new Chart(bookingsChartCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Bookings',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 90],
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Booking Types Chart
    const bookingTypesChartCtx = document.getElementById('bookingTypesChart').getContext('2d');
    const bookingTypesChart = new Chart(bookingTypesChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Flights', 'Hotels', 'Packages', 'Activities', 'Rentals'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(13, 110, 253, 0.7)',
                    'rgba(25, 135, 84, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderColor: [
                    'rgba(13, 110, 253, 1)',
                    'rgba(25, 135, 84, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(108, 117, 125, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Revenue Chart
    const revenueChartCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueChartCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 17000, 22000, 24000, 19000, 21000, 25000, 23000, 26000, 30000],
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                borderColor: 'rgba(25, 135, 84, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Demographics Chart
    const demographicsChartCtx = document.getElementById('demographicsChart').getContext('2d');
    const demographicsChart = new Chart(demographicsChartCtx, {
        type: 'pie',
        data: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
            datasets: [{
                data: [15, 30, 25, 20, 10],
                backgroundColor: [
                    'rgba(13, 110, 253, 0.7)',
                    'rgba(25, 135, 84, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderColor: [
                    'rgba(13, 110, 253, 1)',
                    'rgba(25, 135, 84, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(108, 117, 125, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Profile settings form
    document.getElementById('saveProfileBtn')?.addEventListener('click', function() {
        // Validate passwords match
        const password = document.getElementById('adminPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password && password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // In a real application, this would send data to the server
        alert('Profile settings saved successfully!');
    });
    
    // System settings form
    document.getElementById('saveSystemBtn')?.addEventListener('click', function() {
        // In a real application, this would send data to the server
        alert('System settings saved successfully!');
    });
}