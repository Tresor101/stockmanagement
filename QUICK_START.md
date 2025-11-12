# Quick Start Guide - Hotel Stock Management System

## 🚀 How to Run the Application

### Option 1: Direct Browser Access (Simplest)
1. Navigate to the project folder
2. Double-click `index.html`
3. The login page will open in your default browser

### Option 2: Using Live Server (VS Code)
1. Open the project folder in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Application will open at `http://localhost:5500`

### Option 3: Using Python Server
```bash
cd C:\Users\DELL\Downloads\stockmanagement
python -m http.server 8000
```
Then open: `http://localhost:8000`

### Option 4: Using Node.js
```bash
cd C:\Users\DELL\Downloads\stockmanagement
npx http-server
```
Then open the URL shown in terminal

## 🔐 Login Credentials

### Test All Roles:

**Super Admin Access:**
- Username: `admin`
- Password: `admin123`
- Role: Select "Super Admin"

**Admin Access:**
- Username: `manager`
- Password: `manager123`
- Role: Select "Admin"

**Bar Employee:**
- Username: `staff`
- Password: `staff123`
- Role: Select "Employee - Bar"

**Warehouse Employee:**
- Username: `warehouse`
- Password: `ware123`
- Role: Select "Employee - Warehouse"

**Hotel Room Employee:**
- Username: `room`
- Password: `room123`
- Role: Select "Employee - Hotel Room"

## 📋 What to Test

### 1. Login Page
- ✅ Cover image background (cover.jpg)
- ✅ Credential validation
- ✅ Role-based redirection

### 2. Super Admin Dashboard
- ✅ View all 4 stat cards
- ✅ Check inventory table with filters
- ✅ View user management
- ✅ Check charts
- ✅ Low stock alerts
- ✅ Activity log

### 3. Admin Dashboard
- ✅ Department overview
- ✅ Quick actions
- ✅ Inventory management
- ✅ Charts

### 4. Employee Dashboards
- ✅ Bar: Check beverages inventory
- ✅ Warehouse: Check food items
- ✅ Hotel Room: Check linens and supplies

## 🎯 Key Features to Explore

1. **Navigation**
   - Click sidebar menu items
   - Toggle sidebar with hamburger menu
   - Check responsive design (resize window)

2. **Inventory Management**
   - Search functionality
   - Department filters
   - Status badges (In Stock / Low Stock)

3. **User Management** (Super Admin only)
   - View all users
   - Different role types

4. **Session Management**
   - Auto-logout after 30 minutes
   - Logout button works
   - Login redirects based on role

5. **Visual Features**
   - Animated stat cards
   - Interactive charts
   - Color-coded badges
   - Gradient buttons

## 🐛 Troubleshooting

**Problem: Login page doesn't show background image**
- Solution: Ensure `cover.jpg` is in the root folder

**Problem: Charts not displaying**
- Solution: Check internet connection (Chart.js loads from CDN)

**Problem: Styles look broken**
- Solution: Ensure all CSS files are in the `css/` folder

**Problem: Login doesn't work**
- Solution: Use exact credentials listed above (case-sensitive for password)

## 📱 Mobile Testing

Open in mobile browser or use browser dev tools:
1. Press F12 in browser
2. Click device toolbar icon
3. Select mobile device
4. Test responsive design

## ✨ What's Working

✅ Secure login with role validation
✅ Session management
✅ Role-based dashboards
✅ Responsive design
✅ Interactive charts
✅ Search and filter
✅ Stock management tables
✅ Low stock alerts
✅ User management (Super Admin)
✅ Department-specific views
✅ Real-time clock
✅ Beautiful UI with animations

## 🎨 Color Scheme

- Primary: Blue (#3498db)
- Success: Green (#27ae60)
- Warning: Yellow/Orange (#f39c12)
- Danger: Red (#e74c3c)
- Dark: Navy (#2c3e50)

## 📞 Need Help?

Check the main README.md for detailed documentation.

---

**Enjoy your Hotel Stock Management System! 🏨**
