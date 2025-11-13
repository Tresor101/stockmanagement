# Backend Integration Guide for Hotel Stock Management System
## MySQL Database Structure & API Endpoints

**Date:** November 13, 2025  
**Status:** Frontend Complete - Backend Integration Required

---

## ✅ COMPLETED CHANGES

### 1. Role Restructuring
**Old System:**
- superadmin
- admin
- employee-bar
- employee-warehouse  
- employee-hotel

**New System (✅ Implemented):**
```
Super Admin → Admin (Reports/Audit) → Management → Employees
                                          ├── Receptionist
                                          ├── Stock Person
                                          └── Bartender
```

### 2. Dashboard Files Renamed
- ✅ `employee-hotel-dashboard.html` → `receptionist-dashboard.html`
- ✅ `employee-warehouse-dashboard.html` → `stockperson-dashboard.html`
- ✅ `employee-bar-dashboard.html` → `bartender-dashboard.html`
- ⚠️ `management-dashboard.html` - **NEEDS TO BE CREATED**

### 3. Updated Files
- ✅ `js/auth.js` - New roles, API placeholders
- ✅ `index.html` - New role options
- ✅ All employee dashboards - Updated titles and departments

---

## 📋 REQUIRED DATABASE TABLES

### Table: `users`
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('superadmin', 'admin', 'management', 'receptionist', 'stockperson', 'bartender') NOT NULL,
    department VARCHAR(50),
    hotel_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
```

### Table: `hotels`
```sql
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `rooms`
```sql
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    room_type ENUM('Standard', 'Deluxe', 'Suite') NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    UNIQUE KEY unique_room (hotel_id, room_number)
);
```

### Table: `bookings`
```sql
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    guest_id_number VARCHAR(50) NOT NULL,
    travel_reason VARCHAR(100),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    room_rate DECIMAL(10,2) NOT NULL,
    room_service DECIMAL(10,2) DEFAULT 0,
    extra_fees DECIMAL(10,2) DEFAULT 0,
    charge_notes TEXT,
    status ENUM('Active', 'Checked Out', 'Cancelled') DEFAULT 'Active',
    booked_by INT NOT NULL,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_out_at TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (booked_by) REFERENCES users(id)
);
```

### Table: `bar_inventory`
```sql
CREATE TABLE bar_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category ENUM('Beer', 'Wine', 'Spirits', 'Soft Drinks', 'Other') NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(20),
    price DECIMAL(10,2) NOT NULL,
    min_stock INT DEFAULT 10,
    status ENUM('In Stock', 'Low Stock', 'Out of Stock'),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
```

### Table: `bar_sales`
```sql
CREATE TABLE bar_sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    total_quantity INT NOT NULL,
    payment_method ENUM('Cash', 'Credit Card', 'Mobile Money', 'Room Charge') NOT NULL,
    room_number VARCHAR(10),
    notes TEXT,
    recorded_by INT NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);
```

### Table: `bar_sale_items`
```sql
CREATE TABLE bar_sale_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES bar_sales(id) ON DELETE CASCADE
);
```

### Table: `stock_inventory`
```sql
CREATE TABLE stock_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity INT NOT NULL,
    unit VARCHAR(20),
    min_stock INT DEFAULT 10,
    location VARCHAR(50),
    status ENUM('In Stock', 'Low Stock', 'Out of Stock'),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
```

### Table: `requests`
```sql
CREATE TABLE requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    request_type ENUM('Stock Request', 'Price Change', 'Extra Fees', 'Other') NOT NULL,
    requested_by INT NOT NULL,
    request_details JSON NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
```

### Table: `audit_logs`
```sql
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔌 REQUIRED API ENDPOINTS

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/verify
POST   /api/auth/refresh-token
```

### Users
```
GET    /api/users              (Management, Admin, Super Admin)
GET    /api/users/:id          (Management, Admin, Super Admin)
POST   /api/users              (Management, Super Admin)
PUT    /api/users/:id          (Management, Super Admin)
DELETE /api/users/:id          (Super Admin only)
```

### Rooms & Bookings
```
GET    /api/rooms              (All authenticated users)
GET    /api/rooms/:id          
POST   /api/bookings           (Receptionist, Management)
GET    /api/bookings           
GET    /api/bookings/:id       
PUT    /api/bookings/:id       (Receptionist, Management)
POST   /api/bookings/:id/checkout (Receptionist)
POST   /api/bookings/:id/extra-fees (Receptionist - requires approval)
```

### Bar Sales & Inventory
```
GET    /api/bar/inventory      (Bartender, Management, Admin)
POST   /api/bar/sales          (Bartender)
GET    /api/bar/sales          (Bartender, Management, Admin)
GET    /api/bar/sales/:id      
DELETE /api/bar/sales/:id      (Bartender - same day only)
PUT    /api/bar/inventory/:id  (Stock Person, Management)
```

### Stock Inventory
```
GET    /api/stock/inventory    (Stock Person, Management, Admin)
POST   /api/stock/inventory    (Stock Person, Management)
PUT    /api/stock/inventory/:id (Stock Person, Management)
DELETE /api/stock/inventory/:id (Management only)
```

### Requests & Approvals
```
POST   /api/requests           (All employees)
GET    /api/requests           (Management, Admin)
GET    /api/requests/my        (Current user's requests)
PUT    /api/requests/:id/approve (Management only)
PUT    /api/requests/:id/reject  (Management only)
```

### Reports & Analytics
```
GET    /api/reports/bookings   (Admin, Management)
GET    /api/reports/sales      (Admin, Management)
GET    /api/reports/inventory  (Admin, Management)
GET    /api/reports/employees  (Admin, Management)
GET    /api/reports/audit      (Admin only)
```

### Audit Logs
```
GET    /api/audit/logs         (Admin only)
GET    /api/audit/logs/user/:userId (Admin, Management)
POST   /api/audit/log          (System - called automatically)
```

---

## 🔨 IMMEDIATE TASKS NEEDED

### 1. Create Management Dashboard (**HIGH PRIORITY**)
**File:** `management-dashboard.html`

**Sections needed:**
- Dashboard overview (all hotels stats)
- Employee Management (view, add, edit employees)
- Pending Requests (approve/reject)
- Inventory Overview (all departments)
- Reports Access

**Features:**
- Approve/reject employee requests
- View all bookings across hotels
- Monitor all inventory levels
- Manage employee accounts
- View all sales data

### 2. Update Admin Dashboard (**HIGH PRIORITY**)
**Current:** Has management functions  
**Should be:** Reports and audit logs ONLY

**Remove from Admin:**
- Employee management (move to Management)
- Inventory management (move to Management)

**Keep in Admin:**
- All reports (bookings, sales, inventory, employees)
- Audit logs (all system actions)
- Analytics and charts

### 3. Add Request System to Employee Dashboards
**Locations:**
- `receptionist-dashboard.html` - Request price changes, extra fees approval
- `stockperson-dashboard.html` - Request stock replenishment
- `bartender-dashboard.html` - Request inventory items

**Functionality:**
- Submit request with details
- Track request status (Pending/Approved/Rejected)
- Receive notifications when reviewed

### 4. Add API Integration Layer
**Create:** `js/api.js`

```javascript
// API Configuration
const API_BASE_URL = 'https://your-hostinger-domain.com/api';

// API Helper Functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = sessionStorage.getItem('authToken');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    if (data) options.body = JSON.stringify(data);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication APIs
const authAPI = {
    login: (username, password, role) => 
        apiRequest('/auth/login', 'POST', { username, password, role }),
    logout: () => 
        apiRequest('/auth/logout', 'POST'),
    verify: () => 
        apiRequest('/auth/verify', 'GET')
};

// More API functions...
```

### 5. Update All localStorage to API Calls

**Files to update:**
- `js/hotel-rooms.js` - Replace localStorage with booking API calls
- `js/bar-sales.js` - Replace localStorage with sales API calls
- All dashboard files

**Pattern:**
```javascript
// OLD
const bookings = JSON.parse(localStorage.getItem('roomBookings')) || [];

// NEW
const bookings = await apiRequest('/api/bookings');
```

---

## 📊 DATA MIGRATION PLAN

### Current Data in localStorage:
1. `userSession` - Session data
2. `roomBookings` - Room booking records
3. `barSales` - Bar sales transactions
4. `hotelUsers` - User accounts (demo)

### Migration Steps:
1. Export localStorage data to JSON
2. Create SQL INSERT scripts
3. Import into MySQL database
4. Test API endpoints
5. Switch frontend to use APIs
6. Remove localStorage fallbacks

---

## 🔐 SECURITY REQUIREMENTS

### Authentication
- JWT tokens for API authentication
- Password hashing (bcrypt, min 10 rounds)
- Session timeout (30 minutes)
- HTTPS only in production

### Authorization
- Role-based access control (RBAC)
- API endpoint permissions
- Request validation
- SQL injection prevention

### Audit Trail
- Log all CREATE, UPDATE, DELETE operations
- Log all login/logout events
- Log all request approvals/rejections
- Store IP address and timestamp

---

## 🎯 PERMISSIONS MATRIX

| Action | Super Admin | Admin | Management | Receptionist | Stock Person | Bartender |
|--------|------------|-------|------------|--------------|--------------|-----------|
| Add Users | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View All Reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Audit Logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Requests | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Book Rooms | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Manage Bar Sales | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Manage Inventory | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Submit Requests | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

---

## ✅ CHECKLIST FOR COMPLETION

### Frontend (In Progress)
- [x] Restructure roles and authentication
- [x] Rename employee dashboards
- [x] Update login page
- [ ] Create Management dashboard
- [ ] Update Admin dashboard (reports only)
- [ ] Add request submission to employee dashboards
- [ ] Add request approval to Management dashboard
- [ ] Create `js/api.js` integration layer
- [ ] Replace all localStorage with API calls
- [ ] Add loading states and error handling

### Backend (Not Started)
- [ ] Set up MySQL database on Hostinger
- [ ] Create all database tables
- [ ] Build Node.js/PHP API server
- [ ] Implement JWT authentication
- [ ] Create all API endpoints
- [ ] Add role-based middleware
- [ ] Implement audit logging
- [ ] Add input validation
- [ ] Set up CORS configuration
- [ ] Deploy to Hostinger

### Testing
- [ ] Test all user roles
- [ ] Test request/approval workflow
- [ ] Test API endpoints
- [ ] Test permissions
- [ ] Test audit logging
- [ ] Performance testing
- [ ] Security testing

---

## 🚀 NEXT STEPS

1. **Create `management-dashboard.html`** (Current Priority)
2. **Update `admin-dashboard.html`** (Remove management functions)
3. **Add request system** to all employee dashboards
4. **Create `js/api.js`** integration layer
5. **Set up MySQL database** on Hostinger
6. **Build backend API** (Node.js or PHP)
7. **Test and deploy**

---

## 📝 NOTES

- All frontend code is ready for backend integration
- localStorage is used as fallback - easy to replace with API calls
- Role hierarchy is properly structured
- Audit log placeholders are in place
- System supports multiple hotels (multi-tenant ready)

**Contact:** Ready for backend integration  
**Version:** 2.0.0 (Role Restructure Complete)
