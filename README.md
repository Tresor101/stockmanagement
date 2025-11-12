# Hotel Stock Management System

A comprehensive web-based stock management system for hotels with role-based dashboards for Super Admin, Admin, and three types of employees (Bar, Warehouse, and Hotel Room departments).

## 🏨 Overview

This system provides a complete solution for managing hotel inventory across multiple departments with different access levels and functionalities for each user role.

## ✨ Features

### 🔐 Authentication System
- Secure login with role-based access control
- Session management with automatic timeout (30 minutes)
- Beautiful login page with cover image background
- Password-protected access for all users

### 👥 User Roles & Access Levels

#### 1. **Super Admin** 🛡️
- Complete system access and control
- User management (create, edit, delete users)
- All inventory management across departments
- System-wide analytics and reports
- Department management
- Low stock alerts monitoring
- Stock transfer approvals
- System settings configuration

#### 2. **Admin** 👔
- Inventory management for all departments
- Employee oversight and management
- Stock request approval/rejection
- Department reports and analytics
- Low stock alert notifications
- Stock transfer management

#### 3. **Employee - Bar** 🍸
- View Bar department inventory
- Update stock quantities
- Request stock items
- Track daily usage
- Low stock alerts for bar items

#### 4. **Employee - Warehouse** 📦
- View Warehouse inventory
- Receive shipments
- Transfer stock to other departments
- Update warehouse quantities
- Monitor storage levels

#### 5. **Employee - Hotel Room** 🛏️
- View Hotel Room supplies inventory
- Track linens, toiletries, and amenities
- Request additional supplies
- Room preparation checklists
- Update supply usage

## 📁 Project Structure

```
stockmanagement/
│
├── index.html                          # Login page with cover.jpg background
├── superadmin-dashboard.html           # Super Admin dashboard
├── admin-dashboard.html                # Admin dashboard
├── employee-bar-dashboard.html         # Bar employee dashboard
├── employee-warehouse-dashboard.html   # Warehouse employee dashboard
├── employee-hotel-dashboard.html       # Hotel Room employee dashboard
│
├── css/
│   ├── login.css                       # Login page styles
│   └── dashboard.css                   # Dashboard styles (all roles)
│
├── Js/
│   ├── auth.js                         # Authentication & session management
│   ├── superadmin.js                   # Super Admin functionality
│   ├── admin.js                        # Admin functionality
│   └── employee.js                     # Employee functionality (all types)
│
├── cover.jpg                           # Login page background image
└── README.md                           # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No server required - runs entirely in the browser

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/Tresor101/stockmanagement.git
   cd stockmanagement
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or use a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. **Access the Application**
   - Navigate to `http://localhost:8000` (if using a server)
   - Or open `index.html` directly in your browser

## 🔑 Demo Credentials

### Super Admin
- **Username:** admin
- **Password:** admin123
- **Role:** Super Admin

### Admin
- **Username:** manager
- **Password:** manager123
- **Role:** Admin

OR

- **Username:** supervisor
- **Password:** super123
- **Role:** Admin

### Employees

**Bar Department:**
- **Username:** staff
- **Password:** staff123
- **Role:** Employee - Bar

OR

- **Username:** bartender
- **Password:** bar123
- **Role:** Employee - Bar

**Warehouse Department:**
- **Username:** warehouse
- **Password:** ware123
- **Role:** Employee - Warehouse

OR

- **Username:** stock
- **Password:** stock123
- **Role:** Employee - Warehouse

**Hotel Room Department:**
- **Username:** room
- **Password:** room123
- **Role:** Employee - Hotel Room

OR

- **Username:** housekeeping
- **Password:** house123
- **Role:** Employee - Hotel Room

## 📊 Features by Dashboard

### Super Admin Dashboard
- ✅ Real-time statistics (Total items, Users, Low stock, Departments)
- ✅ Interactive charts (Stock levels, Distribution)
- ✅ Complete inventory table with search and filters
- ✅ User management system
- ✅ Department management
- ✅ Comprehensive reports and analytics
- ✅ Low stock alerts
- ✅ Stock transfer monitoring
- ✅ System settings
- ✅ Recent activity log

### Admin Dashboard
- ✅ Department overview statistics
- ✅ Inventory management
- ✅ Employee monitoring
- ✅ Stock request approvals
- ✅ Reports generation
- ✅ Alert notifications

### Employee Dashboards
- ✅ Department-specific inventory view
- ✅ Stock quantity updates
- ✅ Request stock items
- ✅ Low stock alerts
- ✅ Department-specific features:
  - **Bar:** Daily usage tracking
  - **Warehouse:** Shipment receiving, Stock transfers
  - **Hotel Room:** Room checklists, Supply tracking

## 🎨 Design Features

- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Modern UI:** Clean, professional interface with gradient colors
- **Interactive Charts:** Using Chart.js for data visualization
- **Smooth Animations:** CSS animations for better UX
- **Color-Coded Status:** Visual indicators for stock levels
- **Icon Integration:** Font Awesome icons throughout
- **Bootstrap Framework:** Professional and responsive layout

## 🔒 Security Features

- Session-based authentication
- Role-based access control (RBAC)
- Auto-logout after 30 minutes of inactivity
- Password-protected access
- Credential validation

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (Grid, Flexbox, Gradients)
- **JavaScript (ES6+)** - Functionality and interactivity
- **Bootstrap 5.1.3** - Responsive framework
- **Font Awesome** - Icons
- **Chart.js** - Data visualization
- **Session Storage** - Client-side session management

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 🔄 Sample Inventory Data

The system comes pre-loaded with sample data:

**Bar Department:**
- Whiskey - Johnny Walker (45 bottles)
- Red Wine - Merlot (32 bottles)
- Beer - Heineken (120 bottles)
- Coca Cola (8 crates) - LOW STOCK

**Warehouse:**
- Rice - Basmati (250 kg)
- Cooking Oil (45 liters)
- Coffee Beans (12 kg) - LOW STOCK
- Cleaning Detergent (28 bottles)

**Hotel Room:**
- Bed Linens - Queen (45 sets)
- Towels - Bath (78 pieces)
- Shampoo - Guest Size (15 boxes) - LOW STOCK
- Toilet Paper (92 rolls)

## 🚧 Future Enhancements

- [ ] Backend integration with database (MySQL/MongoDB)
- [ ] Real-time notifications
- [ ] Email alerts for low stock
- [ ] PDF report generation
- [ ] Barcode/QR code scanning
- [ ] Mobile app version
- [ ] Advanced analytics and forecasting
- [ ] Multi-language support

## 📝 License

This project is open source and available for educational and commercial use.

## 👨‍💻 Developer

**Tresor Kalembo Tshibangu**
- GitHub: [@Tresor101](https://github.com/Tresor101)

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review the code comments
3. Contact the developer

---

**Last Updated:** November 12, 2025

**Version:** 1.0.0

Made with ❤️ for efficient hotel inventory management
