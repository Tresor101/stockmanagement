// Employee Dashboard JavaScript (Common for all employee types)
const userData = verifySession();
if (userData) {
    document.getElementById('userName').textContent = userData.name;
}

document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

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

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionName + '-section').classList.add('active');
    
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('li').classList.add('active');
    
    const titles = {
        'dashboard': userData.department + ' Dashboard',
        'inventory': userData.department + ' Inventory',
        'request': 'Request Stock',
        'usage': 'Daily Usage',
        'receive': 'Receive Shipment',
        'transfer': 'Transfer Stock',
        'checklist': 'Room Checklist'
    };
    
    document.getElementById('pageTitle').textContent = titles[sectionName] || sectionName;
}

function updateStock() {
    alert('Update stock functionality - to be implemented with proper form');
}
