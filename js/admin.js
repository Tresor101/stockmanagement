// Admin Dashboard JavaScript
const userData = verifySession('admin');
if (userData) document.getElementById('userName').textContent = userData.name;

document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    initAdminDashboard();
});

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    };
    document.getElementById('datetime').textContent = now.toLocaleString('en-US', options);
}

function toggleSidebar() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('mobile-open');
}

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('mobile-open');
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionName + '-section').classList.add('active');
    document.querySelectorAll('.nav-menu li').forEach(i => i.classList.remove('active'));
    event.target.closest('li').classList.add('active');
    
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.remove('mobile-open');
}

function initAdminDashboard() {
    const ctx = document.getElementById('departmentChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Bar', 'Warehouse', 'Hotel Room'],
                datasets: [{
                    label: 'Items in Stock',
                    data: [120, 250, 180],
                    backgroundColor: ['#3498db', '#27ae60', '#f39c12']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
    
    loadAdminInventory();
}

function loadAdminInventory() {
    const tbody = document.getElementById('adminInventoryTable');
    const items = [
        { code: 'STK001', name: 'Whiskey', dept: 'Bar', qty: 45, status: 'In Stock' },
        { code: 'STK005', name: 'Bed Linens', dept: 'Hotel Room', qty: 45, status: 'In Stock' },
        { code: 'STK009', name: 'Rice', dept: 'Warehouse', qty: 250, status: 'In Stock' },
        { code: 'STK004', name: 'Coca Cola', dept: 'Bar', qty: 8, status: 'Low Stock' }
    ];
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.dept}</td>
            <td><strong>${item.qty}</strong></td>
            <td><span class="badge badge-${item.status === 'Low Stock' ? 'danger' : 'success'}">${item.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Employee Registration Modal Functions (Admin can only register employees, not admins)
function openEmployeeModal() {
    document.getElementById('employeeModal').classList.add('active');
    document.getElementById('employeeForm').reset();
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('active');
    document.getElementById('employeeForm').reset();
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
        department: formData.get('department'),
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    
    // Check if username already exists
    const existingUser = users.find(user => user.username === employeeData.username);
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    // Determine the role based on department
    let authRole = 'employee-bar';
    if (employeeData.department === 'Bar') {
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
    
    // Close modal and show success message
    closeEmployeeModal();
    alert('Employee registered successfully! Username: ' + employeeData.username + '\nDepartment: ' + employeeData.department);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('employeeModal');
    if (event.target === modal) {
        closeEmployeeModal();
    }
});
