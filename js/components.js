// Shared UI Components Library
// Reusable components to reduce code duplication

class Components {
    // Create a stat card
    static statCard(icon, value, label, colorClass = 'stat-primary') {
        return `
            <div class="stat-card ${colorClass}">
                <div class="stat-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="stat-details">
                    <h3>${value}</h3>
                    <p>${label}</p>
                </div>
            </div>
        `;
    }

    // Create a table row
    static tableRow(cells, actions = []) {
        const cellsHTML = cells.map(cell => `<td>${cell}</td>`).join('');
        const actionsHTML = actions.length > 0 
            ? `<td>${actions.map(action => 
                `<button class="btn btn-sm ${action.class}" onclick="${action.onClick}" title="${action.title || ''}">
                    <i class="fas fa-${action.icon}"></i> ${action.text || ''}
                </button>`
              ).join(' ')}</td>`
            : '';
        
        return `<tr>${cellsHTML}${actionsHTML}</tr>`;
    }

    // Create a badge
    static badge(text, type = 'primary') {
        return `<span class="badge badge-${type}">${text}</span>`;
    }

    // Create an alert
    static alert(message, type = 'info', icon = 'info-circle') {
        return `
            <div class="alert alert-${type}">
                <i class="fas fa-${icon}"></i> ${message}
            </div>
        `;
    }

    // Create a form group
    static formGroup(label, inputHTML, required = false, helpText = '') {
        return `
            <div class="form-group">
                <label>${label} ${required ? '<span style="color: red;">*</span>' : ''}</label>
                ${inputHTML}
                ${helpText ? `<small class="form-text text-muted">${helpText}</small>` : ''}
            </div>
        `;
    }

    // Create a text input
    static textInput(name, placeholder = '', required = false, value = '') {
        return `<input type="text" class="form-control" name="${name}" value="${value}" 
                placeholder="${placeholder}" ${required ? 'required' : ''}>`;
    }

    // Create a number input
    static numberInput(name, placeholder = '', required = false, value = '', min = '', max = '', step = '1') {
        return `<input type="number" class="form-control" name="${name}" value="${value}" 
                placeholder="${placeholder}" min="${min}" max="${max}" step="${step}"
                ${required ? 'required' : ''}>`;
    }

    // Create a select dropdown
    static select(name, options, required = false, selected = '') {
        const optionsHTML = options.map(opt => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`;
        }).join('');

        return `
            <select class="form-control" name="${name}" ${required ? 'required' : ''}>
                <option value="">Select...</option>
                ${optionsHTML}
            </select>
        `;
    }

    // Create a textarea
    static textarea(name, placeholder = '', required = false, value = '', rows = 3) {
        return `<textarea class="form-control" name="${name}" rows="${rows}" 
                placeholder="${placeholder}" ${required ? 'required' : ''}>${value}</textarea>`;
    }

    // Create a date input
    static dateInput(name, required = false, value = '', min = '', max = '') {
        return `<input type="date" class="form-control" name="${name}" value="${value}" 
                ${min ? `min="${min}"` : ''} ${max ? `max="${max}"` : ''}
                ${required ? 'required' : ''}>`;
    }

    // Create a loading spinner
    static loader(message = 'Loading...') {
        return `
            <div class="loader-container">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    // Create an empty state message
    static emptyState(icon, message, actionButton = null) {
        const buttonHTML = actionButton 
            ? `<button class="btn ${actionButton.class}" onclick="${actionButton.onClick}">
                <i class="fas fa-${actionButton.icon}"></i> ${actionButton.text}
               </button>`
            : '';
        
        return `
            <div class="empty-state">
                <i class="fas fa-${icon} fa-3x"></i>
                <p>${message}</p>
                ${buttonHTML}
            </div>
        `;
    }

    // Create a card
    static card(title, content, headerActions = '') {
        return `
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-${title.icon || 'info'}"></i> ${title.text || title}</h5>
                    ${headerActions}
                </div>
                <div class="card-body">
                    ${content}
                </div>
            </div>
        `;
    }
}

// Modal Manager
class Modal {
    static show(title, content, buttons = [], size = 'medium') {
        const modalId = 'dynamicModal';
        let modal = document.getElementById(modalId);
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = this.create(modalId, size);
            document.body.appendChild(modal);
        }

        // Update size
        const modalContent = modal.querySelector('.modal-content');
        modalContent.className = `modal-content modal-${size}`;

        // Update content
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;
        
        // Update buttons
        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = buttons.map(btn => 
            `<button type="${btn.type || 'button'}" class="btn ${btn.class}" 
                onclick="(function(){${typeof btn.onClick === 'function' ? btn.onClick.toString() + '()' : btn.onClick}})()">
                ${btn.icon ? `<i class="fas fa-${btn.icon}"></i>` : ''} ${btn.label || btn.text || 'OK'}
            </button>`
        ).join('');

        modal.classList.add('active');
    }

    static create(id, size = 'medium') {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-${size}">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close" onclick="Modal.close()">&times;</button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        `;
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                Modal.close();
            }
        });
        
        return modal;
    }

    static close() {
        const modal = document.getElementById('dynamicModal');
        if (modal) {
            modal.classList.remove('active');
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
            // Clear validation errors
            modal.querySelectorAll('.field-error').forEach(el => el.remove());
            modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        }
    }

    static confirm(title, message, onConfirm, onCancel = null) {
        this.show(title, `<p>${message}</p>`, [
            { 
                label: 'Cancel', 
                class: 'btn-secondary', 
                onClick: onCancel || Modal.close
            },
            { 
                label: 'Confirm', 
                class: 'btn-primary', 
                icon: 'check',
                onClick: () => {
                    if (typeof onConfirm === 'function') onConfirm();
                    Modal.close();
                }
            }
        ]);
    }

    static alert(title, message, type = 'info') {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        this.show(title, 
            `<div class="alert alert-${type}">
                <i class="fas fa-${icons[type]}"></i> ${message}
            </div>`, 
            [{ label: 'OK', class: 'btn-primary', onClick: Modal.close }]
        );
    }
}

// Form Validator
class FormValidator {
    constructor() {
        this.errors = {};
    }

    validate(form, rules) {
        // Accept both form element and form ID
        const formElement = typeof form === 'string' ? document.getElementById(form) : form;
        if (!formElement) return false;

        const formData = new FormData(formElement);
        this.errors = {};

        for (let [field, ruleSet] of Object.entries(rules)) {
            const value = formData.get(field);
            const fieldErrors = [];

            if (ruleSet.required && !value) {
                fieldErrors.push(`This field is required`);
            }

            if (value) {
                if (ruleSet.min !== undefined && parseFloat(value) < ruleSet.min) {
                    fieldErrors.push(`Must be at least ${ruleSet.min}`);
                }

                if (ruleSet.max !== undefined && parseFloat(value) > ruleSet.max) {
                    fieldErrors.push(`Must not exceed ${ruleSet.max}`);
                }

                if (ruleSet.minLength && value.length < ruleSet.minLength) {
                    fieldErrors.push(`Must be at least ${ruleSet.minLength} characters`);
                }

                if (ruleSet.maxLength && value.length > ruleSet.maxLength) {
                    fieldErrors.push(`Must not exceed ${ruleSet.maxLength} characters`);
                }

                if (ruleSet.pattern && !ruleSet.pattern.test(value)) {
                    fieldErrors.push(ruleSet.patternMessage || `Format is invalid`);
                }

                if (ruleSet.custom && !ruleSet.custom(value, formData)) {
                    fieldErrors.push(ruleSet.customMessage || `Value is invalid`);
                }
            }

            if (fieldErrors.length > 0) {
                this.errors[field] = fieldErrors;
            }
        }

        const isValid = Object.keys(this.errors).length === 0;
        if (!isValid) {
            this.showErrors(this.errors, formElement);
        }

        return isValid;
    }

    showErrors(errors, formElement = null) {
        // Clear previous errors first
        this.clearErrors(formElement);

        for (let [field, messages] of Object.entries(errors)) {
            const input = formElement 
                ? formElement.querySelector(`[name="${field}"]`)
                : document.querySelector(`[name="${field}"]`);
            
            if (input) {
                input.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = messages[0];
                input.parentElement.appendChild(errorDiv);
            }
        }
    }

    clearErrors(formElement = null) {
        const container = formElement || document;
        container.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        container.querySelectorAll('.field-error').forEach(el => el.remove());
    }
}

// Utility functions
class Utils {
    static formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    static formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US');
    }

    static formatCurrency(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    }

    static calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Make available globally
window.Components = Components;
window.Modal = Modal;
window.FormValidator = FormValidator;
window.Utils = Utils;
