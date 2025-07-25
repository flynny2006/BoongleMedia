// Join team functionality with cooldown
function joinTeam() {
    const emailInput = document.getElementById('emailInput');
    const joinBtn = document.getElementById('joinBtn');
    const messageDiv = document.getElementById('message');
    const email = emailInput.value.trim();
    
    // Check cooldown
    const lastJoinTime = localStorage.getItem('lastJoinTime');
    const now = Date.now();
    const cooldownTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    if (lastJoinTime && (now - parseInt(lastJoinTime)) < cooldownTime) {
        const remainingTime = Math.ceil((cooldownTime - (now - parseInt(lastJoinTime))) / 1000 / 60);
        showMessage(`Please wait ${remainingTime} more minutes before joining again.`, 'error');
        return;
    }
    
    // Validate email
    if (!email) {
        showMessage('Please enter your email address.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable button and show loading
    joinBtn.disabled = true;
    joinBtn.textContent = 'Joining...';
    
    // Send request to server
    fetch('/api/join-team', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            emailInput.value = '';
            localStorage.setItem('lastJoinTime', now.toString());
            startCooldown();
        } else {
            showMessage(data.error || 'Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Network error. Please try again.', 'error');
    })
    .finally(() => {
        joinBtn.disabled = false;
        joinBtn.textContent = 'Join Team';
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function startCooldown() {
    const joinBtn = document.getElementById('joinBtn');
    const originalText = joinBtn.textContent;
    let timeLeft = 10 * 60; // 10 minutes in seconds
    
    const updateButton = () => {
        if (timeLeft <= 0) {
            joinBtn.disabled = false;
            joinBtn.textContent = originalText;
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        joinBtn.disabled = true;
        joinBtn.textContent = `Wait ${minutes}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
        setTimeout(updateButton, 1000);
    };
    
    updateButton();
}

// Check if user is still in cooldown on page load
document.addEventListener('DOMContentLoaded', function() {
    const lastJoinTime = localStorage.getItem('lastJoinTime');
    if (lastJoinTime) {
        const now = Date.now();
        const cooldownTime = 10 * 60 * 1000; // 10 minutes
        const timePassed = now - parseInt(lastJoinTime);
        
        if (timePassed < cooldownTime) {
            const timeLeft = Math.ceil((cooldownTime - timePassed) / 1000);
            const joinBtn = document.getElementById('joinBtn');
            joinBtn.disabled = true;
            
            let remainingTime = timeLeft;
            const updateButton = () => {
                if (remainingTime <= 0) {
                    joinBtn.disabled = false;
                    joinBtn.textContent = 'Join Team';
                    return;
                }
                
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                joinBtn.textContent = `Wait ${minutes}:${seconds.toString().padStart(2, '0')}`;
                remainingTime--;
                setTimeout(updateButton, 1000);
            };
            
            updateButton();
        }
    }
    
    // Allow Enter key to submit
    document.getElementById('emailInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinTeam();
        }
    });
});