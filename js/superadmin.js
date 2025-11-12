// Super Admin Dashboard JavaScript

// Verify session on page load
const userData = verifySession('superadmin');

if (userData) {
    document.getElementById('userName').textContent = userData.name;
}

// Sample inventory data
let inventoryData = [
    { id: 'STK001', name: 'Whiskey - Johnny Walker', department: 'Bar', category: 'Spirits', quantity: 45, unit: 'Bottles', minLevel: 20, lastUpdated: '2025-11-10' },
    { id: 'STK002', name: 'Red Wine - Merlot', department: 'Bar', category: 'Wine', quantity: 32, unit: 'Bottles', minLevel: 25, lastUpdated: '2025-11-10' },
    { id: 'STK003', name: 'Beer - Heineken', department: 'Bar', category: 'Beer', quantity: 120, unit: 'Bottles', minLevel: 50, lastUpdated: '2025-11-11' },
    { id: 'STK004', name: 'Coca Cola', department: 'Bar', category: 'Soft Drinks', quantity: 8, unit: 'Crates', minLevel: 15, lastUpdated: '2025-11-09' },
    { id: 'STK005', name: 'Bed Linens - Queen', department: 'Hotel Room', category: 'Linens', quantity: 45, unit: 'Sets', minLevel: 30, lastUpdated: '2025-11-11' },
    { id: 'STK006', name: 'Towels - Bath', department: 'Hotel Room', category: 'Linens', quantity: 78, unit: 'Pieces', minLevel: 50, lastUpdated: '2025-11-10' },
    { id: 'STK007', name: 'Shampoo - Guest Size', department: 'Hotel Room', category: 'Toiletries', quantity: 15, unit: 'Boxes', minLevel: 20, lastUpdated: '2025-11-08' },
    { id: 'STK008', name: 'Toilet Paper', department: 'Hotel Room', category: 'Supplies', quantity: 92, unit: 'Rolls', minLevel: 100, lastUpdated: '2025-11-11' },
    { id: 'STK009', name: 'Rice - Basmati', department: 'Warehouse', category: 'Food', quantity: 250, unit: 'Kg', minLevel: 100, lastUpdated: '2025-11-10' },
    { id: 'STK010', name: 'Cooking Oil', department: 'Warehouse', category: 'Food', quantity: 45, unit: 'Liters', minLevel: 30, lastUpdated: '2025-11-11' },
    { id: 'STK011', name: 'Coffee Beans', department: 'Warehouse', category: 'Beverages', quantity: 12, unit: 'Kg', minLevel: 20, lastUpdated: '2025-11-09' },
    { id: 'STK012', name: 'Cleaning Detergent', department: 'Warehouse', category: 'Cleaning', quantity: 28, unit: 'Bottles', minLevel: 25, lastUpdated: '2025-11-10' }
];

let usersData = [
    { username: 'admin', name: 'System Administrator', role: 'Super Admin', department: 'Management', status: 'Active', lastLogin: '2025-11-12 09:30' },
    { username: 'manager', name: 'Hotel Manager', role: 'Admin', department: 'Management', status: 'Active', lastLogin: '2025-11-12 08:15' },
    { username: 'supervisor', name: 'Inventory Supervisor', role: 'Admin', department: 'Management', status: 'Active', lastLogin: '2025-11-11 18:45' },
    { username: 'staff', name: 'Bar Staff', role: 'Employee', department: 'Bar', status: 'Active', lastLogin: '2025-11-12 07:00' },
    { username: 'bartender', name: 'Bartender', role: 'Employee', department: 'Bar', status: 'Active', lastLogin: '2025-11-12 06:30' },
    { username: 'warehouse', name: 'Warehouse Staff', role: 'Employee', department: 'Warehouse', status: 'Active', lastLogin: '2025-11-12 08:00' },
    { username: 'stock', name: 'Stock Keeper', role: 'Employee', department: 'Warehouse', status: 'Active', lastLogin: '2025-11-11 17:20' },
    { username: 'room', name: 'Room Service', role: 'Employee', department: 'Hotel Room', status: 'Active', lastLogin: '2025-11-12 09:00' },
    { username: 'housekeeping', name: 'Housekeeping', role: 'Employee', department: 'Hotel Room', status: 'Active', lastLogin: '2025-11-12 07:30' }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    loadInventoryTable();
    loadUsersTable();
    loadActivityLog();
    loadLowStockAlerts();
    initializeCharts();
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    };
    document.getElementById('datetime').textContent = now.toLocaleString('en-US', options);
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}// Toggle sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update active menu item
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('li').classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Super Admin Dashboard',
        'inventory': 'All Inventory',
        'users': 'User Management',
        'departments': 'Department Management',
        'reports': 'Reports & Analytics',
        'alerts': 'Low Stock Alerts',
        'transfers': 'Stock Transfers',
        'settings': 'System Settings'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName];
}

// Load inventory table
function loadInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';
    
    inventoryData.forEach(item => {
        const status = item.quantity <= item.minLevel ? 
            '<span class="badge badge-danger">Low Stock</span>' : 
            '<span class="badge badge-success">In Stock</span>';
        
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.department}</td>
                <td>${item.category}</td>
                <td><strong>${item.quantity}</strong></td>
                <td>${item.unit}</td>
                <td>${item.minLevel}</td>
                <td>${status}</td>
                <td>${item.lastUpdated}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editItem('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Filter inventory
function filterInventory() {
    const searchTerm = document.getElementById('searchInventory').value.toLowerCase();
    const departmentFilter = document.getElementById('filterDepartment').value;
    
    const filteredData = inventoryData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.id.toLowerCase().includes(searchTerm) ||
                            item.category.toLowerCase().includes(searchTerm);
        const matchesDepartment = !departmentFilter || item.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });
    
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(item => {
        const status = item.quantity <= item.minLevel ? 
            '<span class="badge badge-danger">Low Stock</span>' : 
            '<span class="badge badge-success">In Stock</span>';
        
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.department}</td>
                <td>${item.category}</td>
                <td><strong>${item.quantity}</strong></td>
                <td>${item.unit}</td>
                <td>${item.minLevel}</td>
                <td>${status}</td>
                <td>${item.lastUpdated}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editItem('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load users table
function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    usersData.forEach(user => {
        const statusBadge = user.status === 'Active' ? 
            '<span class="badge badge-success">Active</span>' : 
            '<span class="badge badge-danger">Inactive</span>';
        
        const row = `
            <tr>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td>${user.department}</td>
                <td>${statusBadge}</td>
                <td>${user.lastLogin}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser('${user.username}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load activity log
function loadActivityLog() {
    const activities = [
        { user: 'Stock Keeper', action: 'Added new item: Rice - Basmati (250 Kg)', time: '2 hours ago', icon: 'fa-plus-circle', color: 'success' },
        { user: 'Bar Staff', action: 'Updated stock: Beer - Heineken (120 Bottles)', time: '3 hours ago', icon: 'fa-edit', color: 'primary' },
        { user: 'Room Service', action: 'Low stock alert: Shampoo - Guest Size', time: '5 hours ago', icon: 'fa-exclamation-triangle', color: 'warning' },
        { user: 'Hotel Manager', action: 'Transferred 20 sets of Bed Linens to Hotel Room', time: '1 day ago', icon: 'fa-exchange-alt', color: 'info' },
        { user: 'Warehouse Staff', action: 'Received shipment: Coffee Beans (50 Kg)', time: '2 days ago', icon: 'fa-truck', color: 'success' }
    ];
    
    const container = document.getElementById('activityList');
    container.innerHTML = '';
    
    activities.forEach(activity => {
        const item = `
            <div class="activity-item">
                <i class="fas ${activity.icon} text-${activity.color}"></i>
                <strong>${activity.user}</strong> - ${activity.action}
                <div class="time">${activity.time}</div>
            </div>
        `;
        container.innerHTML += item;
    });
}

// Load low stock alerts
function loadLowStockAlerts() {
    const lowStockItems = inventoryData.filter(item => item.quantity <= item.minLevel);
    document.getElementById('lowStock').textContent = lowStockItems.length;
    
    const container = document.getElementById('alertsContainer');
    if (container) {
        container.innerHTML = '';
        
        lowStockItems.forEach(item => {
            const alert = `
                <div class="alert alert-warning d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>${item.name}</strong> - ${item.department}
                        <br>
                        <small>Current: ${item.quantity} ${item.unit} | Minimum: ${item.minLevel} ${item.unit}</small>
                    </div>
                    <button class="btn btn-sm btn-primary">Reorder</button>
                </div>
            `;
            container.innerHTML += alert;
        });
    }
}

// Initialize charts
function initializeCharts() {
    // Stock levels chart
    const stockCtx = document.getElementById('stockChart');
    if (stockCtx) {
        new Chart(stockCtx, {
            type: 'bar',
            data: {
                labels: ['Bar', 'Warehouse', 'Hotel Room'],
                datasets: [{
                    label: 'Total Items',
                    data: [
                        inventoryData.filter(i => i.department === 'Bar').length,
                        inventoryData.filter(i => i.department === 'Warehouse').length,
                        inventoryData.filter(i => i.department === 'Hotel Room').length
                    ],
                    backgroundColor: ['#3498db', '#27ae60', '#f39c12']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Pie chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Bar', 'Warehouse', 'Hotel Room'],
                datasets: [{
                    data: [
                        inventoryData.filter(i => i.department === 'Bar').length,
                        inventoryData.filter(i => i.department === 'Warehouse').length,
                        inventoryData.filter(i => i.department === 'Hotel Room').length
                    ],
                    backgroundColor: ['#3498db', '#27ae60', '#f39c12']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

// Modal functions (placeholders)
function showAddItemModal() {
    alert('Add Item Modal - Feature to be implemented with proper form');
}

function showAddUserModal() {
    alert('Add User Modal - Feature to be implemented with proper form');
}

function editItem(id) {
    alert('Edit Item: ' + id + ' - Feature to be implemented');
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventoryData = inventoryData.filter(item => item.id !== id);
        loadInventoryTable();
        loadLowStockAlerts();
        alert('Item deleted successfully');
    }
}

function editUser(username) {
    alert('Edit User: ' + username + ' - Feature to be implemented');
}

function deleteUser(username) {
    if (confirm('Are you sure you want to delete this user?')) {
        usersData = usersData.filter(user => user.username !== username);
        loadUsersTable();
        alert('User deleted successfully');
    }
}

// Employee Registration Modal Functions
function openEmployeeModal() {
    document.getElementById('employeeModal').classList.add('active');
    document.getElementById('employeeForm').reset();
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('active');
    document.getElementById('employeeForm').reset();
}

function handleRoleChange(selectElement) {
    const departmentGroup = document.getElementById('departmentGroup');
    if (selectElement.value === 'employee') {
        departmentGroup.style.display = 'block';
        departmentGroup.querySelector('select').setAttribute('required', 'required');
    } else {
        departmentGroup.style.display = 'none';
        departmentGroup.querySelector('select').removeAttribute('required');
    }
}

function handleEmployeeRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const employeeData = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        nextOfKin: {
            name: formData.get('nextOfKinName'),
            phone: formData.get('nextOfKinPhone'),
            address: formData.get('nextOfKinAddress')
        },
        role: formData.get('role'),
        department: formData.get('department') || 'Management',
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // Check if username already exists
    const existingUser = usersData.find(user => user.username === employeeData.username);
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    // Add to users database in auth.js
    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    
    // Determine the role for auth.js
    let authRole = 'employee-bar'; // default
    if (employeeData.role === 'admin') {
        authRole = 'admin';
    } else if (employeeData.department === 'Bar') {
        authRole = 'employee-bar';
    } else if (employeeData.department === 'Warehouse') {
        authRole = 'employee-warehouse';
    } else if (employeeData.department === 'Hotel Room') {
        authRole = 'employee-hotel';
    }
    
    const newUser = {
        username: employeeData.username,
        password: employeeData.password,
        role: authRole,
        name: employeeData.fullName,
        department: employeeData.department,
        phone: employeeData.phone,
        address: employeeData.address,
        nextOfKin: employeeData.nextOfKin,
        createdAt: new Date().toISOString(),
        status: 'Active'
    };
    
    users.push(newUser);
    localStorage.setItem('hotelUsers', JSON.stringify(users));
    
    // Add to local usersData array for display
    usersData.push({
        username: employeeData.username,
        name: employeeData.fullName,
        role: employeeData.role === 'admin' ? 'Admin' : 'Employee',
        department: employeeData.department,
        status: 'Active',
        lastLogin: 'Never'
    });
    
    // Reload users table
    loadUsersTable();
    
    // Close modal and show success message
    closeEmployeeModal();
    alert('Employee registered successfully! Username: ' + employeeData.username);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('employeeModal');
    if (event.target === modal) {
        closeEmployeeModal();
    }
});
