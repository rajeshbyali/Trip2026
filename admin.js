// Admin Panel - Trip Registration CRUD

const STORAGE_KEY = 'trip_registrations';
const ADMIN_USERNAME = 'Rajesh';
const ADMIN_PASSWORD = 'Rajesh@2001';
const AUTH_KEY = 'trip_admin_auth';

// Auth check
function isLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function setLoggedIn(value) {
    sessionStorage.setItem(AUTH_KEY, value ? 'true' : '');
}

// Data
function getRegistrations() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveRegistrations(registrations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    renderTable();
}

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const adminLogout = document.getElementById('admin-logout');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const addNewBtn = document.getElementById('add-new-btn');
const tableBody = document.getElementById('registrations-table-body');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalForm = document.getElementById('modal-form');
const modalClose = document.getElementById('modal-close');

// Show/Hide screens
function showDashboard() {
    loginScreen.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    adminLogout.classList.remove('hidden');
    renderTable();
}

function showLogin() {
    loginScreen.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    adminLogout.classList.add('hidden');
    setLoggedIn(false);
}

// Login
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setLoggedIn(true);
        showDashboard();
        loginMessage.classList.add('hidden');
    } else {
        loginMessage.textContent = 'Invalid username or password';
        loginMessage.className = 'message error';
        loginMessage.classList.remove('hidden');
    }
});

// Logout
adminLogout?.addEventListener('click', showLogin);

// Render table
function renderTable() {
    const registrations = getRegistrations();
    tableBody.innerHTML = '';

    if (registrations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">No registrations yet. Add your first one!</td></tr>';
        return;
    }

    registrations.forEach(reg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.id.slice(-6)}</td>
            <td>${escapeHtml(reg.name)}</td>
            <td>${escapeHtml(reg.mobile)}</td>
            <td>${escapeHtml(reg.vehicle)}</td>
            <td>${escapeHtml(reg.tripDate || 'N/A')}</td>
            <td class="actions">
                <button class="btn btn-edit edit-btn" data-id="${reg.id}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${reg.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Event listeners
    tableBody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    tableBody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteRegistration(btn.dataset.id));
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal
function openAddModal() {
    modalTitle.textContent = 'Add New Registration';
    document.getElementById('edit-id').value = '';
    modalForm.reset();
    modalOverlay.classList.remove('hidden');
}

function openEditModal(id) {
    const registrations = getRegistrations();
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    modalTitle.textContent = 'Edit Registration';
    document.getElementById('edit-id').value = reg.id;
    document.getElementById('modal-name').value = reg.name;
    document.getElementById('modal-mobile').value = reg.mobile;
    document.getElementById('modal-vehicle').value = reg.vehicle;
    document.getElementById('modal-date').value = reg.tripDate === 'N/A' ? '' : reg.tripDate;
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

addNewBtn?.addEventListener('click', openAddModal);
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Modal form submit
modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const registrations = getRegistrations();

    const data = {
        name: document.getElementById('modal-name').value.trim(),
        mobile: document.getElementById('modal-mobile').value.trim(),
        vehicle: document.getElementById('modal-vehicle').value.trim(),
        tripDate: document.getElementById('modal-date').value || 'N/A'
    };

    if (id) {
        const index = registrations.findIndex(r => r.id === id);
        if (index !== -1) {
            registrations[index] = { ...registrations[index], ...data };
        }
    } else {
        data.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        data.createdAt = new Date().toISOString();
        registrations.push(data);
    }

    saveRegistrations(registrations);
    closeModal();
});

// Delete
function deleteRegistration(id) {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    const registrations = getRegistrations().filter(r => r.id !== id);
    saveRegistrations(registrations);
}

// Init - check auth
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        showDashboard();
    } else {
        showLogin();
    }
});
