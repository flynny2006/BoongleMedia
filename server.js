const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize data.json if it doesn't exist
const dataPath = './data.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        joinRequests: [],
        users: []
    }, null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Join team endpoint
app.post('/api/join-team', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        data.joinRequests.push({
            email,
            timestamp: new Date().toISOString()
        });
        
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        res.json({ success: true, message: 'Thank you for your interest!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Auth endpoints
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Check if user already exists
        const existingUser = data.users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const newUser = {
            id: Date.now(),
            username,
            email,
            password, // In production, hash this!
            createdAt: new Date().toISOString()
        };
        
        data.users.push(newUser);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        
        res.json({ success: true, user: { id: newUser.id, username, email } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const user = data.users.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`BoongleMedia server running on http://localhost:${PORT}`);
});