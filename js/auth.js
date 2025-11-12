// Authentication and Session Management

// Demo users database (in production, this would be server-side)
const users = {
    superadmin: {
        'admin': { password: 'admin123', role: 'superadmin', name: 'System Administrator' }
    },
    admin: {
        'manager': { password: 'manager123', role: 'admin', name: 'Hotel Manager' },
        'supervisor': { password: 'super123', role: 'admin', name: 'Inventory Supervisor' }
    },
    'employee-bar': {
        'staff': { password: 'staff123', role: 'employee-bar', name: 'Bar Staff', department: 'Bar' },
        'bartender': { password: 'bar123', role: 'employee-bar', name: 'Bartender', department: 'Bar' }
    },
    'employee-warehouse': {
        'warehouse': { password: 'ware123', role: 'employee-warehouse', name: 'Warehouse Staff', department: 'Warehouse' },
        'stock': { password: 'stock123', role: 'employee-warehouse', name: 'Stock Keeper', department: 'Warehouse' }
    },
    'employee-hotel': {
        'room': { password: 'room123', role: 'employee-hotel', name: 'Room Service', department: 'Hotel Room' },
        'housekeeping': { password: 'house123', role: 'employee-hotel', name: 'Housekeeping', department: 'Hotel Room' }
    }
};

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Clear previous errors
    document.getElementById('loginError').style.display = 'none';
    
    // Validate credentials
    if (!role) {
        showError('Please select a role');
        return false;
    }
    
    if (users[role] && users[role][username]) {
        const user = users[role][username];
        
        if (user.password === password) {
            // Store session
            const sessionData = {
                username: username,
                name: user.name,
                role: role,
                department: user.department || 'Management',
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('userSession', JSON.stringify(sessionData));
            
            // Redirect based on role
            redirectToDashboard(role);
        } else {
            showError('Invalid password');
        }
    } else {
        showError('Invalid username or role combination');
    }
    
    return false;
}

function showError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function redirectToDashboard(role) {
    const dashboardMap = {
        'superadmin': 'superadmin-dashboard.html',
        'admin': 'admin-dashboard.html',
        'employee-bar': 'employee-bar-dashboard.html',
        'employee-warehouse': 'employee-warehouse-dashboard.html',
        'employee-hotel': 'employee-hotel-dashboard.html'
    };
    
    window.location.href = dashboardMap[role];
}

// Check if user is already logged in
function checkSession() {
    const session = sessionStorage.getItem('userSession');
    if (session && window.location.pathname.includes('index.html')) {
        const userData = JSON.parse(session);
        redirectToDashboard(userData.role);
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

// Verify session on dashboard pages
function verifySession(requiredRole = null) {
    const session = sessionStorage.getItem('userSession');
    
    if (!session) {
        window.location.href = 'index.html';
        return null;
    }
    
    const userData = JSON.parse(session);
    
    // Check if user has required role
    if (requiredRole && userData.role !== requiredRole) {
        alert('Access denied! You do not have permission to access this page.');
        logout();
        return null;
    }
    
    return userData;
}

// Auto-logout after inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('Session expired due to inactivity');
        logout();
    }, 30 * 60 * 1000); // 30 minutes
}

// Track user activity
if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSession);
} else {
    checkSession();
}
