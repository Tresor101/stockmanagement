# Hotel Stock Management System

A comprehensive web-based stock management system for hotels with role-based dashboards, unified employee interface, and MySQL backend integration support.

## 🏨 Overview

This system provides a complete solution for managing hotel operations including room bookings, bar sales, and stock inventory with different access levels and functionalities for each user role.

## ✨ Features

### 🔐 Authentication System

- Secure login with role-based access control
- Session management with automatic timeout (30 minutes)
- Beautiful login page with cover image background
- Password-protected access for all users
- 6 distinct user roles with hierarchical permissions

### 👥 User Roles & Access Levels

#### 1. **Super Admin** 🛡️

- Complete system access and control
- User management (create, edit, delete all users)
- All inventory management across departments
- System-wide analytics and reports
- Department management
- Low stock alerts monitoring
- Audit logs and system monitoring
- System settings configuration

#### 2. **Admin** 👔

- View comprehensive reports (bookings, sales, inventory, employees)
- Access audit logs for all system activities
- Monitor system performance and usage
- Export reports and analytics
- No direct management functions (oversight role)

#### 3. **Management** 👨‍💼

- Employee management (create, edit users)
- Request approval/rejection (stock requests, price changes)
- Inventory oversight across all departments
- Department reports access
- Price change approvals

#### 4. **Receptionist** 🛎️

- Room booking management
- Check-in/Check-out operations
- Guest registration
- Room availability tracking
- Booking history and reports
- Submit requests to Management

#### 5. **Stock Person** 📦

- Inventory management (kitchen, bar, housekeeping)
- Stock level monitoring
- Receive shipments
- Stock transfer between departments
- Low stock alerts
- Submit stock requests to Management

#### 6. **Bartender** 🍸

- Bar sales management
- Create and manage sales transactions
- View bar inventory
- Track daily sales
- Sales reports
- Submit requests to Management

## 📁 Project Structure

```text
stockmanagement/
│
├── index.html                          # Login page
├── superadmin-dashboard.html           # Super Admin dashboard
├── admin-dashboard.html                # Admin dashboard (reports & audit)
├── management-dashboard.html           # Management dashboard (coming soon)
├── employee-dashboard.html             # Unified employee dashboard (all 3 roles)
├── receptionist-dashboard.html         # (Legacy - redirects to employee-dashboard)
├── stockperson-dashboard.html          # (Legacy - redirects to employee-dashboard)
├── bartender-dashboard.html            # (Legacy - redirects to employee-dashboard)
│
├── css/
│   ├── login.css                       # Login page styles
│   └── dashboard.css                   # Dashboard styles (all roles)
│
├── js/
│   ├── auth.js                         # Authentication & session management
│   ├── api.js                          # Unified API layer (ready for MySQL)
│   ├── components.js                   # Reusable UI components library
│   ├── employee-unified.js             # Unified employee dashboard controller
│   ├── superadmin.js                   # Super Admin functionality
│   ├── admin.js                        # Admin functionality
│   ├── hotel-rooms.js                  # Room booking management
│   ├── bar-sales.js                    # Bar sales management
│   └── bar-inventory.js                # Bar inventory management
│
├── cover.jpg                           # Login page background image
├── README.md                           # This file
├── QUICK_START.md                      # Quick start guide
├── FEATURES.md                         # Feature documentation
├── BACKEND_INTEGRATION_GUIDE.md        # MySQL integration guide
└── CODE_SIMPLIFICATION_SUMMARY.md      # Code refactoring summary
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

### Management

- **Username:** supervisor
- **Password:** super123
- **Role:** Management

### Receptionist

- **Username:** reception
- **Password:** recep123
- **Role:** Receptionist

### Stock Person

- **Username:** stock
- **Password:** stock123
- **Role:** Stock Person

### Bartender

- **Username:** bartender
- **Password:** bar123
- **Role:** Bartender

## 📊 Features by Dashboard

### Super Admin Dashboard

- ✅ Real-time statistics (Total items, Users, Low stock, Departments)
- ✅ Interactive charts (Stock levels, Distribution)
- ✅ Complete inventory table with search and filters
- ✅ User management system
- ✅ Department management
- ✅ Comprehensive reports and analytics
- ✅ Low stock alerts
- ✅ System-wide monitoring
- ✅ Recent activity log

### Admin Dashboard

- ✅ Comprehensive reports (bookings, sales, inventory, employees)
- ✅ Audit logs and activity tracking
- ✅ System performance monitoring
- ✅ Export functionality
- ✅ Data analytics and insights

### Management Dashboard

- ✅ Employee management (create, edit users)
- ✅ Request approval system (stock, price changes)
- ✅ Inventory oversight (all departments)
- ✅ Department reports access
- ✅ Price change approvals

### Employee Dashboard (Unified)

- ✅ Role-based content (Receptionist, Stock Person, Bartender)
- ✅ Dynamic navigation based on role
- ✅ Department-specific features:
  - **Receptionist:** Room bookings, check-in/check-out, guest management
  - **Stock Person:** Inventory management, stock transfers, low stock alerts
  - **Bartender:** Sales management, bar inventory, sales reports
- ✅ Request submission system
- ✅ Real-time statistics
- ✅ Responsive design

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

### Tresor Kalembo Tshibangu

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
