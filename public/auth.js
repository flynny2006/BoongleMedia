// DOM Elements
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

// Tab switching
loginTab.addEventListener('click', () => {
    switchTab('login');
});

registerTab.addEventListener('click', () => {
    switchTab('register');
});

function switchTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        clearMessages();
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessages();
    }
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showMessage(loginMessage, 'Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/app';
            }, 1500);
        } else {
            showMessage(loginMessage, data.error || 'Login failed', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage(loginMessage, 'Network error. Please try again.', 'error');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showMessage(registerMessage, 'Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(registerMessage, 'Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(registerMessage, 'Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/app';
            }, 1500);
        } else {
            showMessage(registerMessage, data.error || 'Registration failed', 'error');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(registerMessage, 'Network error. Please try again.', 'error');
    }
});

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

function clearMessages() {
    loginMessage.style.display = 'none';
    registerMessage.style.display = 'none';
}