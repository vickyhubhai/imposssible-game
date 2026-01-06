const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Serve static files from games directory
app.use('/games', express.static(path.join(__dirname, 'games')));

// User data storage (in production, use a database)
let users = {}; // Change to object: { name: { games: { gameName: { wins: 0, losses: 0 } } } }
const USERS_FILE = path.join(__dirname, 'names.json');
const RESULTS_DIR = path.join(__dirname, 'results');

// Load existing users
try {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const jsonData = JSON.parse(data);
        users = jsonData.users || {};
    }
} catch (error) {
    console.log('No existing users file found, starting fresh');
}

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR);
}

// Save users to file
function saveUsers() {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Save user results to results folder
function saveUserResults(userName) {
    try {
        const userFile = path.join(RESULTS_DIR, `${userName}.json`);
        fs.writeFileSync(userFile, JSON.stringify(users[userName], null, 2));
    } catch (error) {
        console.error('Error saving user results:', error);
    }
}

// Routes
app.get('/', (req, res) => {
    const userParam = req.query.user;
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

    // If user parameter exists and user is saved, modify HTML to skip name input
    if (userParam && users[userParam]) {
        html = html.replace(
            '<div class="name-section active">',
            '<div class="name-section">'
        );
        html = html.replace(
            '<div class="game-selection">',
            '<div class="game-selection active">'
        );
        html = html.replace(
            '<span id="displayName"></span>',
            userParam
        );
    }

    res.send(html);
});

// API endpoint to save user
app.post('/api/save-user', (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }

    const trimmedName = name.trim();

    if (!users[trimmedName]) {
        users[trimmedName] = {
            games: {
                ticTacToe: { wins: 0, losses: 0 },
                numberGuessing: { wins: 0, losses: 0 },
                reactionTest: { wins: 0, losses: 0 },
                rockPaperScissors: { wins: 0, losses: 0 },
                memory: { wins: 0, losses: 0 },
                mathQuiz: { wins: 0, losses: 0 },
                snake: { wins: 0, losses: 0 },
                wordGuessing: { wins: 0, losses: 0 },
                colorMemory: { wins: 0, losses: 0 }
            }
        };
        saveUsers();
        saveUserResults(trimmedName);
    }

    res.json({ success: true, message: 'User saved successfully' });
});

// API endpoint to check if user exists
app.get('/api/check-user/:name', (req, res) => {
    const name = req.params.name;
    const exists = !!users[name];
    res.json({ exists });
});

// API endpoint to get all users
app.get('/api/users', (req, res) => {
    res.json({ users });
});

// API endpoint to update game result
app.post('/api/update-result', (req, res) => {
    const { user, game, result } = req.body; // result: 'win' or 'loss'

    if (!user || !users[user]) {
        return res.status(400).json({ error: 'User not found' });
    }

    if (!users[user].games[game]) {
        return res.status(400).json({ error: 'Game not found' });
    }

    if (result === 'win') {
        users[user].games[game].wins++;
    } else if (result === 'loss') {
        users[user].games[game].losses++;
    } else {
        return res.status(400).json({ error: 'Invalid result' });
    }

    saveUsers();
    saveUserResults(user);

    res.json({ success: true });
});

// Game routes
app.get('/games/:game', (req, res) => {
    const game = req.params.game;
    const gamePath = path.join(__dirname, 'games', `${game}.html`);

    if (fs.existsSync(gamePath)) {
        res.sendFile(gamePath);
    } else {
        res.status(404).send('Game not found');
    }
});

// Handle game redirects with user context
app.get('/play/:game/:user?', (req, res) => {
    const game = req.params.game;
    const user = req.params.user;
    const gamePath = path.join(__dirname, 'games', `${game}.html`);

    if (fs.existsSync(gamePath)) {
        let html = fs.readFileSync(gamePath, 'utf8');

        // Add user context if provided
        if (user) {
            html = html.replace(
                '<body>',
                `<body data-user="${user}">`
            );
        }

        res.send(html);
    } else {
        res.status(404).send('Game not found');
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🎮 Impossible Games server running on http://localhost:${PORT}`);
    console.log(`📊 Total registered users: ${users.length}`);
    console.log(`🎯 Available games: Tic-Tac-Toe, Number Guessing, Reaction Test, Rock Paper Scissors, Memory Game, Math Quiz, Snake Game, Word Guessing, Color Memory`);
    if (users.length > 0) {
        console.log(`💡 Try: http://localhost:${PORT}/?user=${users[0]}`);
    } else {
        console.log(`💡 Visit: http://localhost:${PORT} to start playing!`);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Impossible Games server...');
    saveUsers();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down Impossible Games server...');
    saveUsers();
    process.exit(0);
});