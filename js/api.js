// Unified API Layer for Backend Integration
// Centralizes all data operations and prepares for MySQL backend

class API {
    constructor(baseURL = '') {
        // In production, this will be your Hostinger domain
        // e.g., 'https://your-domain.com/api'
        this.baseURL = baseURL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api');
        this.token = sessionStorage.getItem('authToken');
    }

    // Core request method
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Add auth token if available
        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Add body for POST/PUT requests
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            // Handle unauthorized
            if (response.status === 401) {
                sessionStorage.clear();
                window.location.href = 'index.html';
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Convenience methods
    get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }

    put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    }

    delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }

    // Update auth token
    setToken(token) {
        this.token = token;
        sessionStorage.setItem('authToken', token);
    }

    // Authentication endpoints
    auth = {
        login: (username, password, role) => 
            this.post('/auth/login', { username, password, role }),
        
        logout: () => 
            this.post('/auth/logout'),
        
        verify: () => 
            this.get('/auth/verify'),
        
        refreshToken: () => 
            this.post('/auth/refresh-token')
    }

    // User management endpoints
    users = {
        getAll: () => 
            this.get('/users'),
        
        getById: (id) => 
            this.get(`/users/${id}`),
        
        create: (userData) => 
            this.post('/users', userData),
        
        update: (id, userData) => 
            this.put(`/users/${id}`, userData),
        
        delete: (id) => 
            this.delete(`/users/${id}`)
    }

    // Room & Booking endpoints
    rooms = {
        getAll: () => 
            this.get('/rooms'),
        
        getById: (id) => 
            this.get(`/rooms/${id}`),
        
        getAvailable: () => 
            this.get('/rooms?status=Available')
    }

    bookings = {
        getAll: () => 
            this.get('/bookings'),
        
        getById: (id) => 
            this.get(`/bookings/${id}`),
        
        create: (bookingData) => 
            this.post('/bookings', bookingData),
        
        update: (id, bookingData) => 
            this.put(`/bookings/${id}`, bookingData),
        
        checkout: (id, checkoutData) => 
            this.post(`/bookings/${id}/checkout`, checkoutData),
        
        addExtraFees: (id, feesData) => 
            this.post(`/bookings/${id}/extra-fees`, feesData),
        
        getActive: () => 
            this.get('/bookings?status=Active')
    }

    // Bar inventory & sales endpoints
    bar = {
        getInventory: () => 
            this.get('/bar/inventory'),
        
        updateInventory: (id, data) => 
            this.put(`/bar/inventory/${id}`, data),
        
        getSales: () => 
            this.get('/bar/sales'),
        
        getSaleById: (id) => 
            this.get(`/bar/sales/${id}`),
        
        createSale: (saleData) => 
            this.post('/bar/sales', saleData),
        
        deleteSale: (id) => 
            this.delete(`/bar/sales/${id}`),
        
        getTodaySales: () => {
            const today = new Date().toISOString().split('T')[0];
            return this.get(`/bar/sales?date=${today}`);
        }
    }

    // Stock inventory endpoints
    stock = {
        getInventory: () => 
            this.get('/stock/inventory'),
        
        getById: (id) => 
            this.get(`/stock/inventory/${id}`),
        
        create: (itemData) => 
            this.post('/stock/inventory', itemData),
        
        update: (id, itemData) => 
            this.put(`/stock/inventory/${id}`, itemData),
        
        delete: (id) => 
            this.delete(`/stock/inventory/${id}`)
    }

    // Request & approval endpoints
    requests = {
        getAll: () => 
            this.get('/requests'),
        
        getMine: () => 
            this.get('/requests/my'),
        
        create: (requestData) => 
            this.post('/requests', requestData),
        
        approve: (id, notes) => 
            this.put(`/requests/${id}/approve`, { notes }),
        
        reject: (id, notes) => 
            this.put(`/requests/${id}/reject`, { notes }),
        
        getPending: () => 
            this.get('/requests?status=Pending')
    }

    // Reports endpoints
    reports = {
        bookings: (startDate, endDate) => 
            this.get(`/reports/bookings?start=${startDate}&end=${endDate}`),
        
        sales: (startDate, endDate) => 
            this.get(`/reports/sales?start=${startDate}&end=${endDate}`),
        
        inventory: () => 
            this.get('/reports/inventory'),
        
        employees: () => 
            this.get('/reports/employees'),
        
        audit: (startDate, endDate) => 
            this.get(`/reports/audit?start=${startDate}&end=${endDate}`)
    }

    // Audit log endpoints
    audit = {
        getLogs: (filters = {}) => {
            const params = new URLSearchParams(filters).toString();
            return this.get(`/audit/logs${params ? '?' + params : ''}`);
        },
        
        getUserLogs: (userId) => 
            this.get(`/audit/logs/user/${userId}`),
        
        log: (action, entityType, entityId, details) => 
            this.post('/audit/log', { action, entityType, entityId, details })
    }
}

// LocalStorage fallback for development (will be replaced with API in production)
class LocalStorageAPI extends API {
    constructor() {
        super();
        this.useLocalStorage = true;
    }

    // Override request to use localStorage for now
    async request(endpoint, method, data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        const [, resource, action] = endpoint.split('/').filter(Boolean);
        
        try {
            // Map endpoints to localStorage operations
            if (resource === 'bookings') {
                return this._handleBookings(method, action, data);
            } else if (resource === 'bar' && action === 'sales') {
                return this._handleBarSales(method, data);
            }
            
            // Fallback to actual API call if not handled
            return super.request(endpoint, method, data);
        } catch (error) {
            console.error('LocalStorage fallback error:', error);
            throw error;
        }
    }

    _handleBookings(method, action, data) {
        const bookings = JSON.parse(localStorage.getItem('roomBookings')) || [];
        
        if (method === 'GET') {
            return { success: true, data: bookings };
        } else if (method === 'POST') {
            bookings.push({ ...data, id: Date.now() });
            localStorage.setItem('roomBookings', JSON.stringify(bookings));
            return { success: true, data: bookings[bookings.length - 1] };
        }
    }

    _handleBarSales(method, data) {
        const sales = JSON.parse(localStorage.getItem('barSales')) || [];
        
        if (method === 'GET') {
            return { success: true, data: sales };
        } else if (method === 'POST') {
            sales.push({ ...data, id: Date.now() });
            localStorage.setItem('barSales', JSON.stringify(sales));
            return { success: true, data: sales[sales.length - 1] };
        }
    }
}

// Export singleton instance
// Use LocalStorageAPI for development, switch to API when backend is ready
const api = new LocalStorageAPI();

// Make available globally
window.api = api;
