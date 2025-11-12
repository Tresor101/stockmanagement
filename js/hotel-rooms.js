// Hotel Room Booking and Management JavaScript

// Sample rooms data
let roomBookings = [
    {
        roomNumber: '101',
        roomType: 'Standard',
        rate: 50,
        guestName: 'John Doe',
        phone: '+243 123 456 789',
        idNumber: 'ID123456',
        travelReason: 'Business',
        checkIn: '2025-11-10',
        checkOut: '2025-11-15',
        roomService: 25,
        extraFees: 10,
        status: 'Occupied'
    },
    {
        roomNumber: '201',
        roomType: 'Deluxe',
        rate: 85,
        guestName: 'Jane Smith',
        phone: '+243 987 654 321',
        idNumber: 'ID789012',
        travelReason: 'Tourism',
        checkIn: '2025-11-11',
        checkOut: '2025-11-14',
        roomService: 0,
        extraFees: 0,
        status: 'Occupied'
    }
];

// Available rooms that haven't been booked
const availableRooms = [
    { number: '102', type: 'Standard', rate: 50 },
    { number: '202', type: 'Deluxe', rate: 85 },
    { number: '301', type: 'Suite', rate: 150 },
    { number: '302', type: 'Suite', rate: 150 }
];

// Variables for admin authentication
let authPurpose = '';
let authField = '';

// Load rooms table on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRoomsTable();
    loadDashboardStats();
    loadCurrentGuestsTable();
});

// Load dashboard statistics
function loadDashboardStats() {
    // Total rooms (6 rooms based on available + sample data)
    const totalRooms = 6;
    
    // Get occupied rooms from localStorage or use sample data
    const bookings = JSON.parse(localStorage.getItem('roomBookings')) || roomBookings;
    const occupiedRooms = bookings.length;
    const availableRooms = totalRooms - occupiedRooms;
    
    // Update stats cards
    document.getElementById('totalRooms').textContent = totalRooms;
    document.getElementById('occupiedRooms').textContent = occupiedRooms;
    document.getElementById('availableRooms').textContent = availableRooms;
}

// Load current guests table
function loadCurrentGuestsTable() {
    const tbody = document.getElementById('currentGuestsTable');
    if (!tbody) return;
    
    // Get bookings from localStorage or use sample data
    const bookings = JSON.parse(localStorage.getItem('roomBookings')) || roomBookings;
    
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No current guests</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const checkInDate = new Date(booking.checkIn);
        const currentDate = new Date();
        
        // Calculate time difference in milliseconds
        const timeDiff = currentDate - checkInDate;
        
        // Calculate days, hours, and minutes
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        // Format timestamp
        const timeSpentFormatted = `${days}d:${hours}h:${minutes}m`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.guestName}</td>
            <td>${booking.roomNumber}</td>
            <td>${booking.roomType}</td>
            <td>${timeSpentFormatted}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="addExtraFeesToGuest('${booking.roomNumber}')" title="Add Extra Fees">
                    <i class="fas fa-plus-circle"></i> Fees
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add extra fees to existing guest (requires admin authentication)
function addExtraFeesToGuest(roomNumber) {
    const booking = roomBookings.find(b => b.roomNumber === roomNumber);
    if (!booking) {
        alert('Booking not found.');
        return;
    }
    
    // Store room number for later use
    window.currentRoomForFees = roomNumber;
    
    // Prompt for fee type
    const feeType = prompt(
        `Add Extra Fees for Room ${roomNumber} (${booking.guestName})\n\n` +
        `Current charges:\n` +
        `- Room Service: $${booking.roomService}\n` +
        `- Extra Fees: $${booking.extraFees}\n\n` +
        `Enter fee type:\n1 = Room Service\n2 = Extra Fees`
    );
    
    if (feeType !== '1' && feeType !== '2') {
        return;
    }
    
    window.currentFeeType = feeType === '1' ? 'roomService' : 'extraFees';
    
    // Require admin authentication
    authPurpose = 'addExtraFees';
    authField = '';
    document.getElementById('adminAuthModal').classList.add('active');
    document.getElementById('authError').style.display = 'none';
}

// Process extra fees after admin authentication
function processExtraFees() {
    const roomNumber = window.currentRoomForFees;
    const feeType = window.currentFeeType;
    
    const booking = roomBookings.find(b => b.roomNumber === roomNumber);
    if (!booking) return;
    
    const feeLabel = feeType === 'roomService' ? 'Room Service' : 'Extra Fees';
    const currentAmount = booking[feeType];
    
    const newFeeStr = prompt(
        `Add ${feeLabel} for Room ${roomNumber}\n\n` +
        `Current ${feeLabel}: $${currentAmount}\n\n` +
        `Enter additional amount to add:`
    );
    
    if (!newFeeStr) return;
    
    const newFee = parseFloat(newFeeStr);
    if (isNaN(newFee) || newFee <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    
    // Update booking
    booking[feeType] += newFee;
    
    // Save to localStorage
    localStorage.setItem('roomBookings', JSON.stringify(roomBookings));
    
    // Reload tables
    loadCurrentGuestsTable();
    loadRoomsTable();
    
    alert(`Successfully added $${newFee.toFixed(2)} to ${feeLabel} for Room ${roomNumber}.\nNew total: $${booking[feeType].toFixed(2)}`);
}


// Load rooms table
function loadRoomsTable() {
    const tbody = document.getElementById('roomsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    roomBookings.forEach(booking => {
        const nights = calculateNights(booking.checkIn, booking.checkOut);
        const roomCharges = nights * booking.rate;
        const additionalCharges = booking.roomService + booking.extraFees;
        const total = roomCharges + additionalCharges;
        
        const row = `
            <tr>
                <td><strong>${booking.roomNumber}</strong></td>
                <td>${booking.roomType}</td>
                <td>$${booking.rate}</td>
                <td>${booking.guestName}</td>
                <td>${formatDate(booking.checkIn)}</td>
                <td>${formatDate(booking.checkOut)}</td>
                <td><span class="badge badge-${booking.status === 'Occupied' ? 'danger' : 'success'}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewBookingDetails('${booking.roomNumber}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="checkOutGuest('${booking.roomNumber}')" title="Check Out">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Open booking modal
function openBookingModal() {
    document.getElementById('bookingModal').classList.add('active');
    document.getElementById('bookingForm').reset();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('input[name="checkInDate"]').setAttribute('min', today);
    document.querySelector('input[name="checkOutDate"]').setAttribute('min', today);
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.getElementById('bookingForm').reset();
}

// Update room price when room is selected
function updateRoomPrice(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const roomType = selectedOption.getAttribute('data-type');
    const price = selectedOption.getAttribute('data-price');
    
    if (roomType && price) {
        document.getElementById('roomType').value = roomType;
        document.getElementById('roomRate').value = price;
        calculateTotals();
    }
}

// Calculate number of nights and totals
function calculateTotals() {
    const checkInDate = document.querySelector('input[name="checkInDate"]').value;
    const checkOutDate = document.querySelector('input[name="checkOutDate"]').value;
    const rate = parseFloat(document.getElementById('roomRate').value) || 0;
    const roomService = parseFloat(document.getElementById('roomService').value) || 0;
    const extraFees = parseFloat(document.getElementById('extraFees').value) || 0;
    
    if (checkInDate && checkOutDate) {
        const nights = calculateNights(checkInDate, checkOutDate);
        document.getElementById('numNights').value = nights;
        
        const roomCharges = nights * rate;
        const additionalCharges = roomService + extraFees;
        const total = roomCharges + additionalCharges;
        
        document.getElementById('roomCharges').value = `$${roomCharges.toFixed(2)}`;
        document.getElementById('additionalCharges').value = `$${additionalCharges.toFixed(2)}`;
        document.getElementById('totalAmount').value = `$${total.toFixed(2)}`;
    }
}

// Calculate nights between two dates
function calculateNights(checkIn, checkOut) {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Add event listeners for date changes
document.addEventListener('DOMContentLoaded', function() {
    const checkInInput = document.querySelector('input[name="checkInDate"]');
    const checkOutInput = document.querySelector('input[name="checkOutDate"]');
    
    if (checkInInput) {
        checkInInput.addEventListener('change', function() {
            const checkIn = this.value;
            checkOutInput.setAttribute('min', checkIn);
            calculateTotals();
        });
    }
    
    if (checkOutInput) {
        checkOutInput.addEventListener('change', calculateTotals);
    }
});

// Request price modification (requires admin authentication)
function requestPriceModification() {
    authPurpose = 'modifyPrice';
    authField = '';
    document.getElementById('adminAuthModal').classList.add('active');
    document.getElementById('authError').style.display = 'none';
}

// Request charge modification (requires admin authentication)
function requestChargeModification(fieldName) {
    authPurpose = 'modifyCharge';
    authField = fieldName;
    document.getElementById('adminAuthModal').classList.add('active');
    document.getElementById('authError').style.display = 'none';
}

// Close admin auth modal
function closeAdminAuthModal() {
    document.getElementById('adminAuthModal').classList.remove('active');
    document.getElementById('adminAuthForm').reset();
    document.getElementById('authError').style.display = 'none';
}

// Verify admin credentials
function verifyAdminCredentials(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Get users from localStorage or use default
    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    
    // Check against hardcoded admin credentials and localStorage
    const isValidAdmin = (username === 'admin' && password === 'admin123') ||
                        (username === 'manager' && password === 'manager123') ||
                        users.some(user => 
                            user.username === username && 
                            user.password === password && 
                            (user.role === 'admin' || user.role === 'superadmin')
                        );
    
    if (isValidAdmin) {
        // Authentication successful
        closeAdminAuthModal();
        
        if (authPurpose === 'modifyPrice') {
            enablePriceModification();
        } else if (authPurpose === 'modifyCharge') {
            enableChargeModification(authField);
        } else if (authPurpose === 'addExtraFees') {
            processExtraFees();
        }
    } else {
        // Show error
        document.getElementById('authError').style.display = 'block';
    }
}

// Enable price modification
function enablePriceModification() {
    const rateInput = document.getElementById('roomRate');
    rateInput.removeAttribute('readonly');
    rateInput.style.background = 'white';
    rateInput.focus();
    
    // Add event listener to recalculate on change
    rateInput.addEventListener('input', calculateTotals);
    
    alert('Price modification enabled. You can now edit the room rate.');
}

// Enable charge modification
function enableChargeModification(fieldName) {
    const chargeInput = document.getElementById(fieldName);
    chargeInput.removeAttribute('readonly');
    chargeInput.style.background = 'white';
    chargeInput.focus();
    
    // Add event listener to recalculate on change
    chargeInput.addEventListener('input', calculateTotals);
    
    const fieldLabel = fieldName === 'roomService' ? 'Room Service' : 'Extra Fees';
    alert(`${fieldLabel} modification enabled. You can now add charges.`);
}

// Handle guest registration
function handleGuestRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const booking = {
        roomNumber: formData.get('roomNumber'),
        roomType: document.getElementById('roomType').value,
        rate: parseFloat(formData.get('roomRate')),
        guestName: formData.get('guestName'),
        phone: formData.get('guestPhone'),
        idNumber: formData.get('idNumber'),
        travelReason: formData.get('travelReason'),
        checkIn: formData.get('checkInDate'),
        checkOut: formData.get('checkOutDate'),
        roomService: parseFloat(formData.get('roomService')) || 0,
        extraFees: parseFloat(formData.get('extraFees')) || 0,
        chargeNotes: formData.get('chargeNotes'),
        status: 'Occupied',
        bookedBy: userData ? userData.name : 'Hotel Staff',
        bookedAt: new Date().toISOString()
    };
    
    // Check if room is already booked
    const existingBooking = roomBookings.find(b => b.roomNumber === booking.roomNumber);
    if (existingBooking) {
        alert('This room is already occupied. Please select a different room.');
        return;
    }
    
    // Add booking to array
    roomBookings.push(booking);
    
    // Save to localStorage
    localStorage.setItem('roomBookings', JSON.stringify(roomBookings));
    
    // Calculate totals for confirmation
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const roomCharges = nights * booking.rate;
    const additionalCharges = booking.roomService + booking.extraFees;
    const total = roomCharges + additionalCharges;
    
    // Show success message
    alert(`Guest registered successfully!\n\nGuest: ${booking.guestName}\nRoom: ${booking.roomNumber} - ${booking.roomType}\nTotal Amount: $${total.toFixed(2)}\n(${nights} nights × $${booking.rate} + Additional charges $${additionalCharges.toFixed(2)})`);
    
    // Reload table and close modal
    loadRoomsTable();
    loadDashboardStats();
    loadCurrentGuestsTable();
    closeBookingModal();
}

// View booking details
function viewBookingDetails(roomNumber) {
    const booking = roomBookings.find(b => b.roomNumber === roomNumber);
    if (!booking) return;
    
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const roomCharges = nights * booking.rate;
    const additionalCharges = booking.roomService + booking.extraFees;
    const total = roomCharges + additionalCharges;
    
    let details = `BOOKING DETAILS - ROOM ${booking.roomNumber}\n\n`;
    details += `═══════════════════════════════════\n`;
    details += `GUEST INFORMATION:\n`;
    details += `Name: ${booking.guestName}\n`;
    details += `Phone: ${booking.phone}\n`;
    details += `ID Number: ${booking.idNumber}\n`;
    details += `Travel Reason: ${booking.travelReason}\n\n`;
    details += `ROOM INFORMATION:\n`;
    details += `Room Number: ${booking.roomNumber}\n`;
    details += `Room Type: ${booking.roomType}\n`;
    details += `Rate per Night: $${booking.rate}\n`;
    details += `Check-In: ${formatDate(booking.checkIn)}\n`;
    details += `Check-Out: ${formatDate(booking.checkOut)}\n`;
    details += `Number of Nights: ${nights}\n\n`;
    details += `CHARGES:\n`;
    details += `Room Charges: $${roomCharges.toFixed(2)}\n`;
    details += `Room Service: $${booking.roomService.toFixed(2)}\n`;
    details += `Extra Fees: $${booking.extraFees.toFixed(2)}\n`;
    if (booking.chargeNotes) {
        details += `Notes: ${booking.chargeNotes}\n`;
    }
    details += `───────────────────────────────────\n`;
    details += `TOTAL AMOUNT: $${total.toFixed(2)}\n`;
    details += `═══════════════════════════════════`;
    
    alert(details);
}

// Check out guest
function checkOutGuest(roomNumber) {
    const booking = roomBookings.find(b => b.roomNumber === roomNumber);
    if (!booking) return;
    
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const roomCharges = nights * booking.rate;
    const additionalCharges = booking.roomService + booking.extraFees;
    const total = roomCharges + additionalCharges;
    
    const confirm = window.confirm(
        `Check out guest from Room ${roomNumber}?\n\n` +
        `Guest: ${booking.guestName}\n` +
        `Total Amount Due: $${total.toFixed(2)}\n\n` +
        `Click OK to proceed with checkout.`
    );
    
    if (confirm) {
        // Remove booking from array
        roomBookings = roomBookings.filter(b => b.roomNumber !== roomNumber);
        
        // Update localStorage
        localStorage.setItem('roomBookings', JSON.stringify(roomBookings));
        
        // Reload table
        loadRoomsTable();
        loadDashboardStats();
        loadCurrentGuestsTable();
        
        alert(`Guest checked out successfully from Room ${roomNumber}.\nFinal bill: $${total.toFixed(2)}`);
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const adminModal = document.getElementById('adminAuthModal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
    if (event.target === adminModal) {
        closeAdminAuthModal();
    }
});
