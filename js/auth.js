// Authentication and Session Management
// NOTE: This will be replaced with MySQL backend API calls
// Current structure uses localStorage for demo - ready for backend integration

// Demo users database (in production, this will be MySQL database)
// Role Hierarchy: Super Admin > Admin (Reports/Audit) > Management (Approvals/Oversight) > Employees
const users = {
    superadmin: {
        'admin': { password: 'admin123', role: 'superadmin', name: 'System Administrator', department: 'System' }
    },
    admin: {
        'manager': { password: 'manager123', role: 'admin', name: 'Hotel Manager', department: 'Administration' },
        'auditor': { password: 'audit123', role: 'admin', name: 'System Auditor', department: 'Administration' }
    },
    management: {
        'supervisor': { password: 'super123', role: 'management', name: 'Operations Manager', department: 'Management' },
        'hotelmanager': { password: 'hotel123', role: 'management', name: 'Hotel Manager', department: 'Management' }
    },
    receptionist: {
        'reception': { password: 'recep123', role: 'receptionist', name: 'Front Desk Receptionist', department: 'Reception' },
        'room': { password: 'room123', role: 'receptionist', name: 'Room Service', department: 'Reception' }
    },
    stockperson: {
        'warehouse': { password: 'ware123', role: 'stockperson', name: 'Warehouse Staff', department: 'Stock' },
        'stock': { password: 'stock123', role: 'stockperson', name: 'Stock Keeper', department: 'Stock' }
    },
    bartender: {
        'bartender': { password: 'bar123', role: 'bartender', name: 'Head Bartender', department: 'Bar' },
        'barstaff': { password: 'staff123', role: 'bartender', name: 'Bar Staff', department: 'Bar' }
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
    
    // TODO: Replace with API call to MySQL backend
    // API endpoint: POST /api/auth/login
    // Body: { username, password, role }
    // Response: { success, user: { id, username, name, role, department, permissions }, token }
    
    if (users[role] && users[role][username]) {
        const user = users[role][username];
        
        if (user.password === password) {
            // Store session
            const sessionData = {
                username: username,
                name: user.name,
                role: role,
                department: user.department || 'General',
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('userSession', JSON.stringify(sessionData));
            
            // TODO: Log login activity to audit table
            // API endpoint: POST /api/audit/log
            // Body: { userId, action: 'LOGIN', timestamp, ipAddress }
            
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
        'management': 'management-dashboard.html',
        // All employee roles use unified dashboard
        'receptionist': 'employee-dashboard.html',
        'stockperson': 'employee-dashboard.html',
        'bartender': 'employee-dashboard.html'
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
    // TODO: Log logout activity to audit table
    // API endpoint: POST /api/audit/log
    // Body: { userId, action: 'LOGOUT', timestamp }
    
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
