# Stock Management System - Features

## Latest Updates (November 2025)

### 🎨 Responsive Design
The entire system is now fully responsive across all devices:

#### Breakpoints
- **Extra Small (< 576px)**: Mobile phones
  - Vertical stat cards
  - Full-width tables with horizontal scroll
  - Stacked form fields
  - Simplified navigation
  
- **Small (576px - 768px)**: Large phones, small tablets
  - Optimized layouts
  - Adjusted font sizes
  - Compact spacing
  
- **Medium (768px - 992px)**: Tablets
  - Collapsible sidebar
  - 2-column stat grid
  - Optimized table views
  
- **Large (992px - 1200px)**: Small desktops
  - Minimized sidebar with icons only
  - 2-column layouts
  
- **Extra Large (> 1200px)**: Large desktops
  - Full sidebar with labels
  - 4-column stat grid
  - Spacious layouts

#### Mobile Features
- Sidebar slides in/out with hamburger menu
- Touch-friendly buttons and forms
- Optimized modal dialogs
- Responsive tables with horizontal scroll
- Adaptive font sizes and spacing

---

### 👥 Employee Registration System

#### Access Levels
- **Super Admin**: Can register both Admins and Employees
- **Admin**: Can only register Employees

#### Registration Form Fields

##### Personal Information
- **Full Name** (required)
- **Phone Number** (required, validated format: +243 XXX XXX XXX)
- **Address** (required, textarea)

##### Next of Kin Information
- **Next of Kin Name** (required)
- **Next of Kin Phone** (required, validated)
- **Next of Kin Address** (required, textarea)

##### Employment Details
- **Role** (Super Admin only):
  - Admin
  - Employee
- **Department** (shown when Employee is selected):
  - Bar
  - Warehouse
  - Hotel Room

##### Account Credentials
- **Username** (required, minimum 4 characters, must be unique)
- **Password** (required, minimum 6 characters)

#### Features
- Real-time form validation
- Username uniqueness check
- Role-based department selection
- Data persistence in localStorage
- Success/error notifications
- Clean modal interface with sections

#### How to Register an Employee

**As Super Admin:**
1. Navigate to "User Management" section
2. Click "Add New User" button
3. Fill in all required fields
4. Select role (Admin or Employee)
5. If Employee, select department
6. Click "Register Employee"

**As Admin:**
1. Navigate to "Employee Management" section
2. Click "Register Employee" button
3. Fill in all required fields
4. Select department (role is automatically Employee)
5. Click "Register Employee"

---

## System Features

### Dashboard Overview
- **Real-time Statistics**: Total items, departments, users, low stock alerts
- **Interactive Charts**: Bar charts, line graphs for analytics
- **Recent Activity**: Live activity feed
- **Low Stock Alerts**: Visual indicators for items below minimum level

### Inventory Management
- **Multi-Department Support**: Bar, Warehouse, Hotel Room
- **Stock Tracking**: Real-time quantity monitoring
- **Category Organization**: Spirits, Wine, Beer, Linens, Toiletries, etc.
- **Search & Filter**: Quick item lookup
- **Add/Edit/Delete**: Full CRUD operations

### User Management
- **5 User Roles**:
  1. Super Admin - Full system access
  2. Admin - Inventory and employee management
  3. Employee-Bar - Bar inventory access
  4. Employee-Warehouse - Warehouse inventory access
  5. Employee-Hotel - Hotel room supplies access

### Security Features
- Session-based authentication
- Role-based access control (RBAC)
- Automatic session timeout
- Password protection
- Logout functionality

### User Interface
- Modern, clean design
- Font Awesome icons
- Bootstrap components
- Smooth animations
- Color-coded status indicators
- Responsive navigation

---

## Demo Credentials

### Super Admin
- Username: `admin`
- Password: `admin123`
- Access: Full system control

### Admin
- Username: `manager`
- Password: `manager123`
- Access: Inventory and employee management

### Employee - Bar
- Username: `staff`
- Password: `staff123`
- Access: Bar inventory only

### Employee - Warehouse
- Username: `warehouse`
- Password: `warehouse123`
- Access: Warehouse inventory only

### Employee - Hotel Room
- Username: `room`
- Password: `room123`
- Access: Hotel room supplies only

---

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.1.3
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Storage**: Session Storage, Local Storage
- **Version Control**: Git/GitHub

---

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/Tresor101/stockmanagement.git
   ```

2. Open `index.html` in your browser

3. Login with demo credentials

4. Explore the features!

---

## Future Enhancements

- [ ] Backend API integration
- [ ] Database connectivity
- [ ] Email notifications
- [ ] Barcode scanning
- [ ] Report generation (PDF/Excel)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics

---

## Support

For issues or questions, please open an issue on GitHub.

**Repository**: https://github.com/Tresor101/stockmanagement
