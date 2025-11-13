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
    static textInput(name, placeholder = '', value = '', required = false, readonly = false) {
        return `<input type="text" name="${name}" value="${value}" placeholder="${placeholder}" 
                ${required ? 'required' : ''} ${readonly ? 'readonly' : ''}>`;
    }

    // Create a number input
    static numberInput(name, value = '', min = '', max = '', step = '1', required = false, readonly = false) {
        return `<input type="number" name="${name}" value="${value}" 
                min="${min}" max="${max}" step="${step}"
                ${required ? 'required' : ''} ${readonly ? 'readonly' : ''}>`;
    }

    // Create a select dropdown
    static select(name, options, selected = '', required = false) {
        const optionsHTML = options.map(opt => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            const attrs = typeof opt === 'object' && opt.attrs ? opt.attrs : '';
            return `<option value="${value}" ${value === selected ? 'selected' : ''} ${attrs}>${label}</option>`;
        }).join('');

        return `
            <select name="${name}" ${required ? 'required' : ''}>
                <option value="">Select...</option>
                ${optionsHTML}
            </select>
        `;
    }

    // Create a textarea
    static textarea(name, placeholder = '', rows = 3, value = '', required = false) {
        return `<textarea name="${name}" rows="${rows}" placeholder="${placeholder}" 
                ${required ? 'required' : ''}>${value}</textarea>`;
    }

    // Create a date input
    static dateInput(name, value = '', required = false, min = '', max = '') {
        return `<input type="date" name="${name}" value="${value}" 
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
    static show(id, title, content, buttons = [], size = 'medium') {
        let modal = document.getElementById(id);
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = this.create(id, size);
            document.body.appendChild(modal);
        }

        // Update content
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;
        
        // Update buttons
        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = buttons.map(btn => 
            `<button type="${btn.type || 'button'}" class="${btn.class}" onclick="${btn.onClick}">
                ${btn.icon ? `<i class="fas fa-${btn.icon}"></i>` : ''} ${btn.text}
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
                    <button class="modal-close" onclick="Modal.close('${id}')">&times;</button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        `;
        return modal;
    }

    static close(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }

    static confirm(title, message, onConfirm, onCancel = null) {
        this.show('confirmModal', title, `<p>${message}</p>`, [
            { 
                text: 'Cancel', 
                class: 'btn-cancel', 
                onClick: onCancel || "Modal.close('confirmModal')" 
            },
            { 
                text: 'Confirm', 
                class: 'btn-primary', 
                icon: 'check',
                onClick: `(${onConfirm.toString()})(); Modal.close('confirmModal');` 
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

        this.show('alertModal', title, 
            `<div class="alert alert-${type}">
                <i class="fas fa-${icons[type]}"></i> ${message}
            </div>`, 
            [{ text: 'OK', class: 'btn-primary', onClick: "Modal.close('alertModal')" }]
        );
    }
}

// Form Validator
class FormValidator {
    static validate(formId, rules) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const errors = {};

        for (let [field, ruleSet] of Object.entries(rules)) {
            const value = formData.get(field);
            const fieldErrors = [];

            if (ruleSet.required && !value) {
                fieldErrors.push(`${ruleSet.label || field} is required`);
            }

            if (value) {
                if (ruleSet.min !== undefined && parseFloat(value) < ruleSet.min) {
                    fieldErrors.push(`${ruleSet.label || field} must be at least ${ruleSet.min}`);
                }

                if (ruleSet.max !== undefined && parseFloat(value) > ruleSet.max) {
                    fieldErrors.push(`${ruleSet.label || field} must not exceed ${ruleSet.max}`);
                }

                if (ruleSet.minLength && value.length < ruleSet.minLength) {
                    fieldErrors.push(`${ruleSet.label || field} must be at least ${ruleSet.minLength} characters`);
                }

                if (ruleSet.maxLength && value.length > ruleSet.maxLength) {
                    fieldErrors.push(`${ruleSet.label || field} must not exceed ${ruleSet.maxLength} characters`);
                }

                if (ruleSet.pattern && !ruleSet.pattern.test(value)) {
                    fieldErrors.push(ruleSet.patternMessage || `${ruleSet.label || field} format is invalid`);
                }

                if (ruleSet.custom && !ruleSet.custom(value, formData)) {
                    fieldErrors.push(ruleSet.customMessage || `${ruleSet.label || field} is invalid`);
                }
            }

            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
            data: Object.fromEntries(formData)
        };
    }

    static showErrors(errors) {
        for (let [field, messages] of Object.entries(errors)) {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = messages[0];
                input.parentNode.appendChild(errorDiv);
            }
        }
    }

    static clearErrors(formId) {
        const form = document.getElementById(formId);
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.field-error').forEach(el => el.remove());
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
