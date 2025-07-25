const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'booglemedia-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Helper function to read data
function readData() {
    try {
        if (fs.existsSync('data.json')) {
            const fileContent = fs.readFileSync('data.json', 'utf8');
            return JSON.parse(fileContent);
        }
        return { joinTeam: [], users: [] };
    } catch (error) {
        console.error('Error reading data.json:', error);
        return { joinTeam: [], users: [] };
    }
}

// Helper function to write data
function writeData(data) {
    try {
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to data.json:', error);
        return false;
    }
}

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Secret app route
app.get('/app', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'app.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'auth.html'));
    }
});

// Handle join team requests
app.post('/join-team', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const data = readData();
    
    // Add new entry to joinTeam array
    const newEntry = {
        email: email,
        timestamp: new Date().toISOString()
    };
    
    data.joinTeam.push(newEntry);

    if (writeData(data)) {
        res.json({ success: true, message: 'Successfully joined the team!' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Handle user registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const data = readData();
    
    // Check if user already exists
    const existingUser = data.users.find(user => user.email === email || user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Add new user
    const newUser = {
        id: Date.now().toString(),
        username: username,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    data.users.push(newUser);

    if (writeData(data)) {
        req.session.userId = newUser.id;
        req.session.username = newUser.username;
        res.json({ success: true, message: 'Registration successful!' });
    } else {
        res.status(500).json({ error: 'Failed to save user data' });
    }
});

// Handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const data = readData();
    
    // Find user by username or email
    const user = data.users.find(user => 
        (user.username === username || user.email === username) && user.password === password
    );

    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Handle logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully!' });
});

app.listen(PORT, () => {
    console.log(`BoongleMedia server running on http://localhost:${PORT}`);
});