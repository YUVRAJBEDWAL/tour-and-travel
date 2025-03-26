// Payment details object
const paymentDetails = {
    upiId: 'yuvraj.bedwal@axl',
    amount: '0',
    transactionNote: 'Travel Package Payment', 
    name: 'TravelPay'
};

// Function to update amount display and refresh QR code
function updateAmountDisplay(amount) {
    const amountDisplay = document.getElementById('amountDisplay');
    if (amountDisplay) {
        amountDisplay.textContent = `₹${amount}`;
    }
}

// Function to handle package selection and payment details
function selectPackage(packageName, price) {
    const guestCount = parseInt(document.getElementById('guestCount').value) || 1;
    const baseAmount = price * guestCount;
    const taxes = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + taxes;

    // Update payment details
    paymentDetails.amount = totalAmount.toString();
    paymentDetails.transactionNote = `${packageName} (${guestCount} guests)`;
    
    // Update displays
    updateAmountDisplay(totalAmount);
    
    // Update QR code with new amount
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${paymentDetails.upiId}&pn=${paymentDetails.name}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(paymentDetails.transactionNote)}`;
    document.getElementById('qrCode').src = qrCodeUrl;
    
    // Update booking summary
    const packageDetails = document.getElementById('packageDetails');
    packageDetails.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div class="booking-detail">
                <span class="detail-label">Package</span>
                <span class="detail-value">${packageName}</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">Base Price</span>
                <span>₹${baseAmount}</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">Taxes & Fees</span>
                <span>₹${taxes}</span>
            </div>
            <div class="booking-detail total-amount">
                <span>Total Amount</span>
                <span>₹${totalAmount}</span>
            </div>
        </div>
    `;
}

// Function to update dates
function updateDates() {
    // This function will be called when date inputs change
    updateTotalPrice();
}

// Function to update total price when guest count changes
function updateTotalPrice() {
    // Get the currently selected package details
    const packageDetails = document.getElementById('packageDetails');
    const packageName = packageDetails.querySelector('.detail-value')?.textContent;
    
    // Only update if a package has been selected
    if (packageName && packageName !== 'Select a package above') {
        // Find the price from the package selection
        let basePrice = 0;
        if (packageName.includes('Manali')) basePrice = 5999;
        else if (packageName.includes('Goa')) basePrice = 7999;
        else if (packageName.includes('Kerala')) basePrice = 9999;
        
        // Re-select the package to update prices
        selectPackage(packageName, basePrice);
    }
}

// Function to show payment receipt
function showPaymentReceipt() {
    // Generate random booking ID
    const bookingId = 'TRP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    
    // Get package details
    const packageName = document.querySelector('.detail-value')?.textContent || 'Package';
    const basePrice = document.querySelector('.booking-detail:nth-child(2) span:last-child')?.textContent || '₹0';
    const taxes = document.querySelector('.booking-detail:nth-child(3) span:last-child')?.textContent || '₹0';
    const totalAmount = document.querySelector('.total-amount span:last-child')?.textContent || '₹0';
    
    // Get dates
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    let dateText = 'Dates not specified';
    
    if (startDate && endDate) {
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN');
        };
        dateText = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    // Get guest count
    const guestCount = document.getElementById('guestCount').value;
    
    // Update receipt modal
    document.getElementById('receiptBookingId').textContent = bookingId;
    document.getElementById('receiptPackage').textContent = packageName;
    document.getElementById('receiptDates').textContent = dateText;
    document.getElementById('receiptGuests').textContent = guestCount + (guestCount > 1 ? ' Guests' : ' Guest');
    document.getElementById('receiptBasePrice').textContent = basePrice;
    document.getElementById('receiptTaxes').textContent = taxes;
    document.getElementById('receiptTotal').textContent = totalAmount;
    
    // Show modal
    document.getElementById('receiptModal').classList.add('show');
}

// Function to close receipt modal
function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('show');
}

// Initialize toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add event listeners for copy buttons
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copyUpiBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(paymentDetails.upiId);
        showToast('UPI ID copied to clipboard');
    });
    
    document.getElementById('copyAmountBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(paymentDetails.amount);
        showToast('Amount copied to clipboard');
    });
    
    document.getElementById('openUpiBtn').addEventListener('click', function() {
        // Create UPI intent URL
        const upiUrl = `upi://pay?pa=${paymentDetails.upiId}&pn=${paymentDetails.name}&am=${paymentDetails.amount}&cu=INR&tn=${encodeURIComponent(paymentDetails.transactionNote)}`;
        window.location.href = upiUrl;
    });
    
    document.getElementById('checkPaymentBtn').addEventListener('click', function() {
        showToast('Checking payment status...');
        // In a real app, you would check the payment status with your backend
        setTimeout(() => {
            showToast('Payment successful!');
            // Show payment receipt after 1 second
            setTimeout(() => {
                showPaymentReceipt();
            }, 1000);
        }, 1500);
    });
});