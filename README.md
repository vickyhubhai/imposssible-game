# 🎮 Impossible Games

**Made by Vicky**

A collection of impossible-to-win games built with Node.js and Express. Features user management, multiple games, and a sleek dark theme.

## 🚀 Features

- **User Management**: Save and track user names
- **Multiple Games**: Snake, Memory Game, Tic-Tac-Toe, Math Quiz, Name Guessing, Color Memory, Reaction Test
- **Dark Theme**: Modern glassmorphism design
- **Restart Functionality**: Restart any game at any time
- **Server-side Storage**: User data persisted on the server

## 🛠️ Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## 🎯 How to Play

1. **Enter your name** - It will be saved for future visits
2. **Choose a game** from the selection menu
3. **Try to win** (but you can't - they're impossible! 😈)
4. **Use restart buttons** to play again
5. **Return anytime** - your name will be remembered

## 🎮 Available Games

- **🐍 Snake**: Large board (20x20) with high speed - nearly impossible to survive long
- **🧠 Memory Game**: Sequences get progressively longer and faster
- **❌ Tic-Tac-Toe**: Perfect AI using minimax - mathematically unbeatable!
- **🧮 Math Quiz**: Complex calculations with numbers up to 50
- **📝 Name Guessing**: Guess names with hints (first, middle, last letters)
- **🎨 Color Memory**: Long color sequences shown quickly
- **⚡ Reaction Test**: Extreme wait times (3-6 seconds) make timing impossible

## 🏗️ Project Structure

```
├── index.js          # Main server file
├── index.html        # Main game menu
├── names.json        # User data storage
├── games/            # Individual game files
│   ├── snake.html
│   ├── memory.html
│   └── rps.html
├── package.json      # Dependencies
└── README.md         # This file
```

## 🔧 API Endpoints

- `GET /` - Main game menu
- `GET /?user=Name` - Direct access for saved users
- `POST /api/save-user` - Save a new user
- `GET /api/users` - Get all saved users
- `GET /play/:game/:user?` - Play a specific game

## 🖥️ Development

For development with auto-restart:
```bash
npm run dev
```

## 📝 Notes

- All games are designed to be "impossible" to win
- User data is stored in `names.json`
- The server runs on port 3000 by default
- Static files are served from the root directory

## 🎨 Customization

- Modify `index.html` for UI changes
- Update game files in the `games/` directory
- Change server settings in `index.js`
- Customize the dark theme in the CSS

---

**Made by Vicky**

**Have fun trying to win the impossible games! 🎮**