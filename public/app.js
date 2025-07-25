// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const usernameSpan = document.getElementById('username');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // This would normally fetch user data from the server
    // For now, we'll just show a placeholder
    usernameSpan.textContent = 'User';
});

// Logout functionality
logoutBtn.addEventListener('click', async function() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Search functionality (placeholder)
searchBtn.addEventListener('click', function() {
    const query = searchInput.value.trim();
    if (query) {
        console.log('Searching for:', query);
        // Search functionality will be implemented later
    }
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Navigation item click handlers (placeholder)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        console.log('Navigated to:', this.textContent.trim());
        // Navigation functionality will be implemented later
    });
});