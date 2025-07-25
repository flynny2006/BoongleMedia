// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showMainApp(user);
    } else {
        showAuthModal();
    }
});

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp(user) {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('welcomeUser').textContent = `Welcome, ${user.username}!`;
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    clearAuthMessage();
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    clearAuthMessage();
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!username || !password) {
        showAuthMessage('Please fill in all fields.', 'error');
        return;
    }
    
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showMainApp(data.user);
            clearAuthForms();
        } else {
            showAuthMessage(data.error || 'Login failed. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAuthMessage('Network error. Please try again.', 'error');
    });
}

function register() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    
    if (!username || !email || !password) {
        showAuthMessage('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showMainApp(data.user);
            clearAuthForms();
        } else {
            showAuthMessage(data.error || 'Registration failed. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAuthMessage('Network error. Please try again.', 'error');
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    showAuthModal();
    clearAuthForms();
}

function showAuthMessage(text, type) {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        clearAuthMessage();
    }, 5000);
}

function clearAuthMessage() {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}

function clearAuthForms() {
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    clearAuthMessage();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle Enter key for forms
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm.style.display !== 'none') {
            login();
        } else if (registerForm.style.display !== 'none') {
            register();
        }
    }
});

// Search functionality (placeholder)
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.getElementById('searchBar');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchBar.value.trim();
            if (query) {
                // Placeholder for search functionality
                console.log('Searching for:', query);
                // Future: implement search
            }
        });
    }
    
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchBar.value.trim();
                if (query) {
                    console.log('Searching for:', query);
                    // Future: implement search
                }
            }
        });
    }
});