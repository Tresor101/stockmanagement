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
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionName + '-section').classList.add('active');
    document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
    event.target.closest('li').classList.add('active');
    
    const titles = {
        'dashboard': 'Admin Dashboard',
        'inventory': 'Inventory Management',
        'employees': 'Employee Management',
        'reports': 'Reports',
        'requests': 'Stock Requests',
        'alerts': 'Alerts'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName];
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
