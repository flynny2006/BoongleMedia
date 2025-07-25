// DOM Elements
const joinTeamBtn = document.getElementById('joinTeamBtn');
const modal = document.getElementById('joinTeamModal');
const closeBtn = document.querySelector('.close');
const joinTeamForm = document.getElementById('joinTeamForm');
const emailInput = document.getElementById('emailInput');
const cooldownMessage = document.getElementById('cooldownMessage');

// Constants
const COOLDOWN_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const COOLDOWN_KEY = 'boogleMediaJoinTeamCooldown';

// Check cooldown on page load
document.addEventListener('DOMContentLoaded', function() {
    checkCooldown();
});

// Open modal
joinTeamBtn.addEventListener('click', function() {
    if (isOnCooldown()) {
        showCooldownMessage();
        return;
    }
    modal.style.display = 'block';
});

// Close modal
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    clearMessages();
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        clearMessages();
    }
});

// Handle form submission
joinTeamForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    if (isOnCooldown()) {
        showCooldownMessage();
        return;
    }
    
    try {
        const response = await fetch('/join-team', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Set cooldown
            setCooldown();
            
            // Show success message
            showMessage('Successfully joined the team! We\'ll contact you soon.', 'success');
            
            // Clear form
            emailInput.value = '';
            
            // Close modal after 2 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                clearMessages();
            }, 2000);
            
        } else {
            showMessage(data.error || 'An error occurred. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    }
});

// Cooldown functions
function isOnCooldown() {
    const lastSubmission = localStorage.getItem(COOLDOWN_KEY);
    if (!lastSubmission) return false;
    
    const timeDiff = Date.now() - parseInt(lastSubmission);
    return timeDiff < COOLDOWN_TIME;
}

function setCooldown() {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
    updateButtonState();
}

function getRemainingCooldownTime() {
    const lastSubmission = localStorage.getItem(COOLDOWN_KEY);
    if (!lastSubmission) return 0;
    
    const timeDiff = Date.now() - parseInt(lastSubmission);
    const remaining = COOLDOWN_TIME - timeDiff;
    return Math.max(0, remaining);
}

function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function checkCooldown() {
    if (isOnCooldown()) {
        updateButtonState();
        startCooldownTimer();
    }
}

function updateButtonState() {
    if (isOnCooldown()) {
        const remaining = getRemainingCooldownTime();
        joinTeamBtn.disabled = true;
        joinTeamBtn.textContent = `Join Team (${formatTime(remaining)})`;
    } else {
        joinTeamBtn.disabled = false;
        joinTeamBtn.textContent = 'Join Team';
    }
}

function startCooldownTimer() {
    const timer = setInterval(() => {
        if (!isOnCooldown()) {
            clearInterval(timer);
            updateButtonState();
            return;
        }
        updateButtonState();
    }, 1000);
}

function showCooldownMessage() {
    const remaining = getRemainingCooldownTime();
    showMessage(`Please wait ${formatTime(remaining)} before joining again.`, 'cooldown');
}

function showMessage(message, type) {
    cooldownMessage.textContent = message;
    cooldownMessage.className = `cooldown-message ${type}`;
    cooldownMessage.style.display = 'block';
}

function clearMessages() {
    cooldownMessage.textContent = '';
    cooldownMessage.style.display = 'none';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});