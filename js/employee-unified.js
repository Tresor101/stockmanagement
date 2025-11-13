// Unified Employee Dashboard JavaScript
// Handles all employee roles: Receptionist, Stock Person, Bartender

class EmployeeDashboard {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        // Verify session and get user data
        this.userData = verifySession();
        if (!this.userData) return;

        // Setup dashboard based on role
        this.setupDashboard();
        this.loadData();
        
        // Update date/time
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    setupDashboard() {
        const role = this.userData.role;
        
        // Update header based on role
        this.updateHeader(role);
        
        // Setup navigation menu
        this.setupNavigation(role);
        
        // Show only relevant sections
        this.showRoleSections(role);
    }

    updateHeader(role) {
        const config = {
            receptionist: {
                icon: 'concierge-bell',
                name: 'Reception Department',
                color: '#f093fb'
            },
            stockperson: {
                icon: 'boxes',
                name: 'Stock Department',
                color: '#11998e'
            },
            bartender: {
                icon: 'glass-martini-alt',
                name: 'Bar Department',
                color: '#667eea'
            }
        };

        const dept = config[role];
        document.getElementById('departmentIcon').className = `fas fa-${dept.icon}`;
        document.getElementById('departmentName').textContent = dept.name;
        document.getElementById('userName').textContent = this.userData.name;
        document.getElementById('userRole').textContent = this.userData.department;
        document.getElementById('userAvatar').style.background = `linear-gradient(135deg, ${dept.color} 0%, #764ba2 100%)`;
    }

    setupNavigation(role) {
        const navMenus = {
            receptionist: [
                { id: 'dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
                { id: 'rooms', icon: 'door-open', label: 'Rooms' },
                { id: 'requests', icon: 'clipboard-list', label: 'Requests' }
            ],
            stockperson: [
                { id: 'dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
                { id: 'inventory', icon: 'boxes', label: 'Inventory' },
                { id: 'requests', icon: 'clipboard-list', label: 'Requests' }
            ],
            bartender: [
                { id: 'dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
                { id: 'sales', icon: 'cash-register', label: 'Sales' },
                { id: 'requests', icon: 'clipboard-list', label: 'Requests' }
            ]
        };

        const menu = navMenus[role] || [];
        const navHTML = menu.map((item, index) => `
            <li ${index === 0 ? 'class="active"' : ''}>
                <a href="#" onclick="EmployeeDashboard.instance.showSection('${item.id}'); return false;">
                    <i class="fas fa-${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            </li>
        `).join('');

        document.getElementById('navMenu').innerHTML = navHTML;
    }

    showRoleSections(role) {
        // Hide all role-specific sections
        document.querySelectorAll('.role-module').forEach(section => {
            section.style.display = 'none';
        });

        // Show sections for current role
        document.querySelectorAll(`[data-role="${role}"]`).forEach(section => {
            section.style.display = 'block';
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update active menu item
        document.querySelectorAll('.nav-menu li').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('li').classList.add('active');

        // Close mobile menu
        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('mobile-open');
    }

    async loadData() {
        const role = this.userData.role;

        // Load dashboard stats
        await this.loadDashboardStats(role);

        // Load role-specific data
        if (role === 'receptionist') {
            await this.loadReceptionData();
        } else if (role === 'stockperson') {
            await this.loadStockData();
        } else if (role === 'bartender') {
            await this.loadBarData();
        }

        // Load requests (common for all)
        await this.loadRequests();
    }

    async loadDashboardStats(role) {
        const statsContainer = document.getElementById('dashboardStats');
        
        if (role === 'receptionist') {
            // Load from localStorage for now (will be API call)
            const bookings = JSON.parse(localStorage.getItem('roomBookings')) || [];
            const totalRooms = 6;
            const occupied = bookings.length;
            const available = totalRooms - occupied;

            statsContainer.innerHTML = 
                Components.statCard('door-open', totalRooms, 'Total Rooms', 'stat-primary') +
                Components.statCard('user-check', occupied, 'Rooms Occupied', 'stat-danger') +
                Components.statCard('door-closed', available, 'Rooms Available', 'stat-success');

            // Load current guests table
            this.loadCurrentGuestsTable(bookings);

        } else if (role === 'stockperson') {
            statsContainer.innerHTML = 
                Components.statCard('boxes', '1,247', 'Total Items', 'stat-primary') +
                Components.statCard('exclamation-triangle', '12', 'Low Stock', 'stat-warning') +
                Components.statCard('check-circle', '1,235', 'In Stock', 'stat-success');

        } else if (role === 'bartender') {
            const sales = JSON.parse(localStorage.getItem('barSales')) || [];
            const today = new Date().toISOString().split('T')[0];
            const todaySales = sales.filter(s => s.date.split('T')[0] === today);
            const totalSales = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
            const avgSale = todaySales.length > 0 ? totalSales / todaySales.length : 0;

            statsContainer.innerHTML = 
                Components.statCard('dollar-sign', `$${totalSales.toFixed(2)}`, "Today's Sales", 'stat-success') +
                Components.statCard('shopping-bag', todaySales.length, 'Transactions', 'stat-primary') +
                Components.statCard('chart-line', `$${avgSale.toFixed(2)}`, 'Average Sale', 'stat-info');
        }
    }

    loadCurrentGuestsTable(bookings) {
        const content = document.getElementById('dashboardContent');
        if (!content) return;

        const tableHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-users"></i> Current Guests</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Guest Name</th>
                                        <th>Room Number</th>
                                        <th>Room Type</th>
                                        <th>Time Spent</th>
                                        <th>Check-In</th>
                                        <th>Check-Out</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="currentGuestsTable"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = tableHTML;

        // Populate table
        const tbody = document.getElementById('currentGuestsTable');
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No current guests</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(booking => {
            const checkInDate = new Date(booking.checkIn);
            const currentDate = new Date();
            const timeDiff = currentDate - checkInDate;
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

            return Components.tableRow(
                [
                    booking.guestName,
                    booking.roomNumber,
                    booking.roomType,
                    `${days}d:${hours}h:${minutes}m`,
                    Utils.formatDate(booking.checkIn),
                    Utils.formatDate(booking.checkOut)
                ],
                [
                    { icon: 'plus-circle', text: 'Fees', class: 'btn-warning', 
                      onClick: `EmployeeDashboard.instance.addExtraFees('${booking.roomNumber}')` }
                ]
            );
        }).join('');
    }

    async loadReceptionData() {
        // Load rooms with bookings
        const bookings = JSON.parse(localStorage.getItem('roomBookings')) || [];
        // This will be replaced with: await api.bookings.getAll();
        
        this.loadRoomsTable(bookings);
    }

    loadRoomsTable(bookings) {
        const tbody = document.getElementById('roomsTableBody');
        if (!tbody) return;

        const allRooms = [
            { number: '101', type: 'Standard', rate: 60 },
            { number: '102', type: 'Standard', rate: 60 },
            { number: '201', type: 'Deluxe', rate: 80 },
            { number: '202', type: 'Deluxe', rate: 80 },
            { number: '301', type: 'Suite', rate: 100 },
            { number: '302', type: 'Suite', rate: 100 }
        ];

        tbody.innerHTML = allRooms.map(room => {
            const booking = bookings.find(b => b.roomNumber === room.number);
            const status = booking ? 'Occupied' : 'Available';
            const statusBadge = booking 
                ? Components.badge('Occupied', 'danger')
                : Components.badge('Available', 'success');

            const actions = booking
                ? [
                    { icon: 'eye', text: '', class: 'btn-primary', onClick: `EmployeeDashboard.instance.viewBooking('${room.number}')`, title: 'View Details' },
                    { icon: 'sign-out-alt', text: '', class: 'btn-danger', onClick: `EmployeeDashboard.instance.checkoutGuest('${room.number}')`, title: 'Check Out' }
                  ]
                : [];

            return Components.tableRow(
                [
                    room.number,
                    room.type,
                    Utils.formatCurrency(room.rate),
                    booking ? booking.guestName : '-',
                    booking ? Utils.formatDate(booking.checkIn) : '-',
                    booking ? Utils.formatDate(booking.checkOut) : '-',
                    statusBadge
                ],
                actions
            );
        }).join('');
    }

    async loadStockData() {
        // Sample stock data (will be replaced with API call)
        const stockItems = [
            { name: 'Whiskey - Johnny Walker', category: 'Spirits', quantity: 45, unit: 'Bottles', status: 'In Stock' },
            { name: 'Red Wine - Merlot', category: 'Wine', quantity: 32, unit: 'Bottles', status: 'In Stock' },
            { name: 'Coca Cola', category: 'Soft Drinks', quantity: 8, unit: 'Crates', status: 'Low Stock' }
        ];

        const tbody = document.getElementById('stockInventoryTable');
        if (!tbody) return;

        tbody.innerHTML = stockItems.map(item => {
            const statusBadge = item.status === 'Low Stock' 
                ? Components.badge('Low Stock', 'danger')
                : Components.badge('In Stock', 'success');

            return Components.tableRow(
                [item.name, item.category, `<strong>${item.quantity}</strong>`, item.unit, statusBadge],
                [
                    { icon: 'edit', text: 'Update', class: 'btn-primary', onClick: `EmployeeDashboard.instance.updateStock(${item.id})` }
                ]
            );
        }).join('');
    }

    async loadBarData() {
        const sales = JSON.parse(localStorage.getItem('barSales')) || [];
        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales.filter(s => s.date.split('T')[0] === today);

        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        if (todaySales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sales recorded today</td></tr>';
            return;
        }

        tbody.innerHTML = todaySales.sort((a, b) => new Date(b.date) - new Date(a.date)).map(sale => {
            const time = new Date(sale.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const items = sale.items.map(i => `${i.name} (${i.quantity})`).join(', ');

            return Components.tableRow(
                [time, items, sale.totalQuantity, `<strong>${Utils.formatCurrency(sale.totalAmount)}</strong>`, 
                 Components.badge(sale.paymentMethod, 'info')],
                [
                    { icon: 'eye', text: '', class: 'btn-primary', onClick: `EmployeeDashboard.instance.viewSale(${sale.id})`, title: 'View Details' },
                    { icon: 'trash', text: '', class: 'btn-danger', onClick: `EmployeeDashboard.instance.deleteSale(${sale.id})`, title: 'Delete' }
                ]
            );
        }).join('');
    }

    async loadRequests() {
        // Will be replaced with API call
        const tbody = document.getElementById('requestsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No requests submitted</td></tr>';
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleString('en-US', options);
    }

    // Role-specific actions
    openBookingModal() {
        // Will create booking modal
        Modal.alert('Feature', 'Booking modal will be created', 'info');
    }

    addExtraFees(roomNumber) {
        Modal.alert('Add Fees', `Add extra fees for room ${roomNumber}`, 'info');
    }

    viewBooking(roomNumber) {
        const bookings = JSON.parse(localStorage.getItem('roomBookings')) || [];
        const booking = bookings.find(b => b.roomNumber === roomNumber);
        if (!booking) return;

        const nights = Utils.calculateDays(booking.checkIn, booking.checkOut);
        const roomCharges = nights * booking.rate;
        const additionalCharges = (booking.roomService || 0) + (booking.extraFees || 0);
        const total = roomCharges + additionalCharges;

        Modal.alert(
            `Booking Details - Room ${roomNumber}`,
            `<div style="text-align: left;">
                <strong>Guest:</strong> ${booking.guestName}<br>
                <strong>Phone:</strong> ${booking.phone}<br>
                <strong>Check-In:</strong> ${Utils.formatDate(booking.checkIn)}<br>
                <strong>Check-Out:</strong> ${Utils.formatDate(booking.checkOut)}<br>
                <strong>Nights:</strong> ${nights}<br><br>
                <strong>Room Charges:</strong> ${Utils.formatCurrency(roomCharges)}<br>
                <strong>Additional:</strong> ${Utils.formatCurrency(additionalCharges)}<br>
                <strong>Total:</strong> ${Utils.formatCurrency(total)}
            </div>`,
            'info'
        );
    }

    checkoutGuest(roomNumber) {
        Modal.alert('Checkout', `Checkout guest from room ${roomNumber}`, 'info');
    }

    openSaleModal() {
        Modal.alert('Feature', 'Sale modal will be created', 'info');
    }

    viewSale(saleId) {
        Modal.alert('Sale Details', `View details for sale #${saleId}`, 'info');
    }

    deleteSale(saleId) {
        Modal.confirm('Delete Sale', 'Are you sure you want to delete this sale?', 
            () => {
                const sales = JSON.parse(localStorage.getItem('barSales')) || [];
                const filtered = sales.filter(s => s.id !== saleId);
                localStorage.setItem('barSales', JSON.stringify(filtered));
                this.loadBarData();
                Utils.showNotification('Sale deleted successfully', 'success');
            }
        );
    }

    addStockItem() {
        Modal.alert('Feature', 'Add stock item form will be created', 'info');
    }

    updateStock(itemId) {
        Modal.alert('Feature', `Update stock item ${itemId}`, 'info');
    }

    submitRequest() {
        Modal.alert('Feature', 'Request submission form will be created', 'info');
    }
}

// Toggle mobile menu
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('mobile-open');
}

// Create and export singleton instance
EmployeeDashboard.instance = new EmployeeDashboard();
