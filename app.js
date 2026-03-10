// Trip Registration - Main Application

const STORAGE_KEY = 'trip_registrations';

// Initialize data structure
function getRegistrations() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveRegistrations(registrations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Registration Form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const messageEl = document.getElementById('form-message');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const vehicle = document.getElementById('vehicle').value.trim();
        const tripDate = document.getElementById('trip-date').value;

        const registrations = getRegistrations();
        registrations.push({
            id: generateId(),
            name,
            mobile,
            vehicle,
            tripDate: tripDate || 'N/A',
            createdAt: new Date().toISOString()
        });
        saveRegistrations(registrations);

        showMessage(messageEl, 'Trip registered successfully!', 'success');
        form.reset();
    });

    // Initialize map
    initTripMap();
});

function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `message ${type}`;
    el.classList.remove('hidden');
    setTimeout(() => {
        el.classList.add('hidden');
    }, 4000);
}

// Trip Map - Full Karnataka Circuit: Davangere-Sirsi-Yana-Gokarna-Honnavar-Apsarakonda-Murudeshwara-Kolluru-Kundapura-Maravanthe-Malpe-Udupi-Kateel-Agumbe-Karkala-Dharmasthala-Davangere
function initTripMap() {
    const container = document.getElementById('trip-map-container');
    if (!container) return;

    const routeWaypoints = [
        { lat: 14.4644, lng: 75.9218, name: 'Davangere (Start)', type: 'start' },
        { lat: 14.6167, lng: 74.8333, name: 'Sirsi', type: 'waypoint' },
        { lat: 14.5333, lng: 74.5833, name: 'Yana', type: 'waypoint' },
        { lat: 14.5500, lng: 74.3167, name: 'Gokarna', type: 'waypoint' },
        { lat: 14.2833, lng: 74.4500, name: 'Honnavar', type: 'waypoint' },
        { lat: 14.2167, lng: 74.4833, name: 'Apsarakonda Beach', type: 'waypoint' },
        { lat: 14.0936, lng: 74.4838, name: 'Murudeshwara', type: 'waypoint' },
        { lat: 13.8667, lng: 74.7167, name: 'Kolluru', type: 'waypoint' },
        { lat: 13.6167, lng: 74.6833, name: 'Kundapura', type: 'waypoint' },
        { lat: 13.7533, lng: 74.6483, name: 'Maravanthe Beach', type: 'waypoint' },
        { lat: 13.3494, lng: 74.7178, name: 'Malpe', type: 'waypoint' },
        { lat: 13.3417, lng: 74.7350, name: 'Udupi', type: 'waypoint' },
        { lat: 13.1500, lng: 74.8333, name: 'Kateelu', type: 'waypoint' },
        { lat: 13.5167, lng: 75.0833, name: 'Agumbe', type: 'waypoint' },
        { lat: 13.2000, lng: 74.9833, name: 'Karkala', type: 'waypoint' },
        { lat: 12.9454, lng: 75.3839, name: 'Dharmasthala', type: 'waypoint' },
        { lat: 14.4644, lng: 75.9218, name: 'Davangere (End)', type: 'end' }
    ];

    const map = L.map('trip-map-container').setView([13.8, 75.0], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const routeLine = routeWaypoints.map(w => [w.lat, w.lng]);
    L.polyline(routeLine, {
        color: '#e8a838',
        weight: 5,
        opacity: 0.9
    }).addTo(map);

    const startIcon = L.divIcon({
        className: 'custom-marker start',
        html: '<div style="background:#22c55e;width:20px;height:20px;border-radius:50%;border:3px solid white;"></div>',
        iconSize: [26, 26]
    });

    const waypointIcon = L.divIcon({
        className: 'custom-marker waypoint',
        html: '<div style="background:#e8a838;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>',
        iconSize: [16, 16]
    });

    const endIcon = L.divIcon({
        className: 'custom-marker end',
        html: '<div style="background:#ef4444;width:20px;height:20px;border-radius:50%;border:3px solid white;"></div>',
        iconSize: [26, 26]
    });

    routeWaypoints.forEach((wp) => {
        const icon = wp.type === 'start' ? startIcon : wp.type === 'end' ? endIcon : waypointIcon;
        L.marker([wp.lat, wp.lng], { icon })
            .addTo(map)
            .bindPopup(`<strong>${wp.name}</strong><br>${wp.type === 'start' ? 'Bike Trip Start' : wp.type === 'end' ? 'Bike Trip End' : 'Route Stop'}`);
    });

    map.fitBounds(routeLine, { padding: [50, 50] });
}
