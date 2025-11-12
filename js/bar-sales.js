// Bar Sales Management JavaScript

// Load sales from localStorage or use empty array
let barSales = JSON.parse(localStorage.getItem('barSales')) || [];

// Load sales data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSalesStats();
    loadSalesTable();
    
    // Show/hide room number field based on payment method
    const paymentMethodSelect = document.querySelector('select[name="paymentMethod"]');
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            const roomNumberGroup = document.getElementById('roomNumberGroup');
            if (this.value === 'Room Charge') {
                roomNumberGroup.style.display = 'block';
                document.querySelector('input[name="roomNumber"]').required = true;
            } else {
                roomNumberGroup.style.display = 'none';
                document.querySelector('input[name="roomNumber"]').required = false;
            }
        });
    }
});

// Open sale modal
function openSaleModal() {
    document.getElementById('saleModal').classList.add('active');
    calculateSaleTotals();
}

// Close sale modal
function closeSaleModal() {
    document.getElementById('saleModal').classList.remove('active');
    document.getElementById('saleForm').reset();
    
    // Reset to single item row
    const container = document.getElementById('saleItemsContainer');
    const firstRow = container.querySelector('.sale-item-row');
    container.innerHTML = '';
    if (firstRow) {
        firstRow.querySelectorAll('input').forEach(input => input.value = '');
        firstRow.querySelector('select').selectedIndex = 0;
        container.appendChild(firstRow);
    }
    
    calculateSaleTotals();
}

// Update item price when item is selected
function updateItemPrice(selectElement) {
    const row = selectElement.closest('.sale-item-row');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.getAttribute('data-price');
    
    if (price) {
        row.querySelector('.item-price').value = price;
        calculateItemTotal(row.querySelector('input[name="itemQuantity[]"]'));
    }
}

// Calculate total for a single item
function calculateItemTotal(quantityInput) {
    const row = quantityInput.closest('.sale-item-row');
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    const total = price * quantity;
    
    row.querySelector('.item-total').value = total.toFixed(2);
    calculateSaleTotals();
}

// Calculate sale totals
function calculateSaleTotals() {
    const itemRows = document.querySelectorAll('.sale-item-row');
    let totalItems = 0;
    let totalAmount = 0;
    
    itemRows.forEach(row => {
        const quantity = parseInt(row.querySelector('input[name="itemQuantity[]"]').value) || 0;
        const itemTotal = parseFloat(row.querySelector('.item-total').value) || 0;
        
        totalItems += quantity;
        totalAmount += itemTotal;
    });
    
    document.getElementById('totalItems').value = totalItems;
    document.getElementById('totalAmount').value = '$' + totalAmount.toFixed(2);
}

// Add new item row
function addItemRow() {
    const container = document.getElementById('saleItemsContainer');
    const firstRow = container.querySelector('.sale-item-row');
    const newRow = firstRow.cloneNode(true);
    
    // Clear values in new row
    newRow.querySelectorAll('input').forEach(input => {
        if (input.type === 'number') {
            input.value = input.name === 'itemQuantity[]' ? '1' : '';
        } else {
            input.value = '';
        }
    });
    newRow.querySelector('select').selectedIndex = 0;
    
    container.appendChild(newRow);
}

// Remove item row
function removeItemRow(button) {
    const container = document.getElementById('saleItemsContainer');
    const rows = container.querySelectorAll('.sale-item-row');
    
    if (rows.length > 1) {
        button.closest('.sale-item-row').remove();
        calculateSaleTotals();
    } else {
        alert('At least one item is required for a sale.');
    }
}

// Handle sale registration
function handleSaleRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Collect sale items
    const itemNames = formData.getAll('itemName[]');
    const itemQuantities = formData.getAll('itemQuantity[]');
    const itemPrices = formData.getAll('itemPrice[]');
    const itemTotals = formData.getAll('itemTotal[]');
    
    const items = [];
    let totalAmount = 0;
    let totalQuantity = 0;
    
    for (let i = 0; i < itemNames.length; i++) {
        if (itemNames[i]) {
            const itemTotal = parseFloat(itemTotals[i]) || 0;
            const quantity = parseInt(itemQuantities[i]) || 0;
            
            items.push({
                name: itemNames[i],
                quantity: quantity,
                price: parseFloat(itemPrices[i]) || 0,
                total: itemTotal
            });
            
            totalAmount += itemTotal;
            totalQuantity += quantity;
        }
    }
    
    if (items.length === 0) {
        alert('Please add at least one item to the sale.');
        return;
    }
    
    // Create sale record
    const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: items,
        totalQuantity: totalQuantity,
        totalAmount: totalAmount,
        paymentMethod: formData.get('paymentMethod'),
        roomNumber: formData.get('roomNumber') || null,
        notes: formData.get('saleNotes'),
        recordedBy: userData ? userData.name : 'Bar Staff',
        recordedAt: new Date().toLocaleString('en-US')
    };
    
    // Add to sales array
    barSales.push(sale);
    
    // Save to localStorage
    localStorage.setItem('barSales', JSON.stringify(barSales));
    
    // Show success message
    alert(`Sale recorded successfully!\n\nTotal Amount: $${totalAmount.toFixed(2)}\nPayment: ${sale.paymentMethod}\n\nThank you!`);
    
    // Reload stats and table
    loadSalesStats();
    loadSalesTable();
    closeSaleModal();
}

// Load sales statistics
function loadSalesStats() {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = barSales.filter(sale => sale.date.split('T')[0] === today);
    
    let totalSales = 0;
    let totalTransactions = todaySales.length;
    
    todaySales.forEach(sale => {
        totalSales += sale.totalAmount;
    });
    
    const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    document.getElementById('todaySales').textContent = '$' + totalSales.toFixed(2);
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('averageSale').textContent = '$' + averageSale.toFixed(2);
}

// Load sales table
function loadSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    const today = new Date().toISOString().split('T')[0];
    const todaySales = barSales.filter(sale => sale.date.split('T')[0] === today);
    
    tbody.innerHTML = '';
    
    if (todaySales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sales recorded today</td></tr>';
        return;
    }
    
    // Sort by date (newest first)
    todaySales.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    todaySales.forEach(sale => {
        const time = new Date(sale.date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Create items summary
        const itemsSummary = sale.items.map(item => 
            `${item.name} (${item.quantity})`
        ).join(', ');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${time}</td>
            <td>${itemsSummary}</td>
            <td><strong>${sale.totalQuantity}</strong></td>
            <td><strong>$${sale.totalAmount.toFixed(2)}</strong></td>
            <td><span class="badge badge-info">${sale.paymentMethod}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewSaleDetails(${sale.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSale(${sale.id})" title="Delete Sale">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// View sale details
function viewSaleDetails(saleId) {
    const sale = barSales.find(s => s.id === saleId);
    if (!sale) return;
    
    let details = `╔════════════════════════════════════════════════╗\n`;
    details += `║              SALE RECEIPT                      ║\n`;
    details += `╚════════════════════════════════════════════════╝\n\n`;
    
    details += `Sale ID:        #${sale.id}\n`;
    details += `Date & Time:    ${sale.recordedAt}\n`;
    details += `Recorded By:    ${sale.recordedBy}\n\n`;
    
    details += `ITEMS PURCHASED:\n`;
    details += `─────────────────────────────────────────────────\n`;
    
    sale.items.forEach((item, index) => {
        details += `${index + 1}. ${item.name}\n`;
        details += `   ${item.quantity} × $${item.price.toFixed(2)} = $${item.total.toFixed(2)}\n`;
    });
    
    details += `\n═════════════════════════════════════════════════\n`;
    details += `Total Items:                 ${sale.totalQuantity}\n`;
    details += `TOTAL AMOUNT:                $${sale.totalAmount.toFixed(2)}\n`;
    details += `═════════════════════════════════════════════════\n\n`;
    
    details += `Payment Method:  ${sale.paymentMethod}\n`;
    if (sale.roomNumber) {
        details += `Room Number:     ${sale.roomNumber}\n`;
    }
    if (sale.notes) {
        details += `Notes:           ${sale.notes}\n`;
    }
    
    details += `\nThank you for your purchase!`;
    
    alert(details);
}

// Delete sale
function deleteSale(saleId) {
    const sale = barSales.find(s => s.id === saleId);
    if (!sale) return;
    
    const confirm = window.confirm(
        `Delete this sale?\n\n` +
        `Amount: $${sale.totalAmount.toFixed(2)}\n` +
        `Items: ${sale.totalQuantity}\n\n` +
        `This action cannot be undone.`
    );
    
    if (confirm) {
        barSales = barSales.filter(s => s.id !== saleId);
        localStorage.setItem('barSales', JSON.stringify(barSales));
        
        loadSalesStats();
        loadSalesTable();
        
        alert('Sale deleted successfully.');
    }
}
