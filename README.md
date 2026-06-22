# Art Pictionary Game 🎨

A multiplayer Pictionary game featuring famous artworks from around the world. Players draw famous paintings while others guess - built with React, Express, and Socket.IO.

## 🌟 Features

✨ **Multiplayer Gaming** (up to 6 players)
- Real-time drawing and guessing
- Socket.IO powered live updates
- Multiple players can join with unique codes

🎨 **Canvas Drawing Tools**
- Multiple brush colors
- Adjustable brush sizes
- Eraser tool
- Undo/Redo functionality
- Clear canvas

📚 **51 Famous Artworks**
- Curated collection of masterpieces
- Difficulty levels (Easy, Medium, Hard)
- Artist information

🌍 **Bilingual Support**
- Turkish (Türkçe)
- English

⏱️ **Customizable Game Settings**
- Adjustable drawing time (30s, 60s, 90s, 120s)
- Adjustable rounds (1, 3, 5)
- 15-second artwork preview

🏆 **Scoring System**
- Speed-based points
- Real-time leaderboard
- Round-by-round scoring

## 📦 Tech Stack

### Backend
- **Node.js** with Express.js
- **Socket.IO** for real-time WebSocket communication
- **UUID** for unique game code generation
- **CORS** for cross-origin requests

### Frontend
- **React 18** with Hooks
- **Vite** for fast development and building
- **Socket.IO Client** for real-time communication
- **Zustand** for state management
- **CSS3** for styling and animations

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/DenizTaylan51/art-pictionary-game.git
cd art-pictionary-game
```

#### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Create .env file
echo "PORT=3000" > .env
echo "CLIENT_URL=http://localhost:5173" >> .env

# Start backend server
npm run dev:server
```
Backend runs on http://localhost:3000

#### 3. Frontend Setup (in another terminal)
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start React dev server
npm run dev
```
Frontend runs on http://localhost:5173

#### 4. Run Both Concurrently (optional)
```bash
# From root directory
npm run dev:all
```

## 🎮 How to Play

1. **Home Page**: Choose "Create Game" or "Join Game"
2. **Create Game**: 
   - Set your player name
   - Configure drawing time (30-120 seconds)
   - Choose number of rounds (1-5)
   - Game code is generated automatically
3. **Join Game**:
   - Enter the game code from another player
   - Enter your player name
4. **Game Flow**:
   - **Preview Phase**: All players see the artwork for 15 seconds
   - **Drawing Phase**: One player draws the artwork
   - **Guessing Phase**: Other players submit guesses
   - **Scoring**: Points awarded based on speed and accuracy
5. **Leaderboard**: Real-time score tracking

## 🎨 Game Rules

- **Drawer**: Must draw the artwork within the time limit without using text
- **Guessers**: Submit guesses of the artwork title or artist name
- **Scoring**: 
  - First correct guess: ~100 points (decreases over time)
  - Subsequent correct guesses: fewer points
  - Each player can only guess once per round
- **Rounds**: Game continues for the configured number of rounds with rotating drawers

## 🌐 API Endpoints

### REST API
- `POST /api/games` - Create new game
  - Body: `{ drawingTime: number, maxRounds: number, language: string }`
  - Returns: `{ gameId: string, game: GameState }`
- `GET /api/games/:gameId` - Get current game state
- `GET /health` - Server health check

### Socket.IO Events

#### Client → Server
- `join-game` - Join existing game
  - Data: `{ gameId, playerId, playerName }`
- `start-game` - Start the game
  - Data: `{ gameId }`
- `draw` - Send drawing stroke
  - Data: `{ gameId, drawData }`
- `guess` - Submit guess
  - Data: `{ gameId, playerId, guess }`
- `undo` - Undo last drawing action
  - Data: `{ gameId }`
- `redo` - Redo drawing action
  - Data: `{ gameId }`
- `clear-canvas` - Clear entire canvas
  - Data: `{ gameId }`

#### Server → Client
- `game-state` - Full game state update
- `player-joined` - New player joined
- `player-left` - Player disconnected
- `artwork-preview` - Show artwork preview
- `drawing-start` - Drawing phase started
- `guessing-start` - Guessing phase started
- `correct-guess` - Someone guessed correctly
- `round-end` - Round finished
- `game-over` - Game finished
- `draw` - Receive drawing data from drawer
- `undo` - Receive undo command
- `redo` - Receive redo command
- `clear-canvas` - Receive canvas clear command
- `error` - Error message

## 📁 Project Structure

```
art-pictionary-game/
├── server/
│   ├── models/
│   │   └── Game.js              # Game logic and state management
│   ├── data/
│   │   └── artworks.js          # 51 famous artworks database
│   ├── utils/
│   │   └── translations.js      # Backend translations
│   └── index.js                 # Express server and Socket.IO setup
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.jsx       # Drawing canvas component
│   │   │   ├── Canvas.css
│   │   │   ├── Timer.jsx        # Countdown timer
│   │   │   ├── Timer.css
│   │   │   ├── Leaderboard.jsx  # Score display
│   │   │   ├── Leaderboard.css
│   │   │   ├── ArtworkPreview.jsx # Preview component
│   │   │   ├── ArtworkPreview.css
│   │   │   ├── GuessingPanel.jsx # Guess input form
│   │   │   └── GuessingPanel.css
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Home and game creation
│   │   │   ├── HomePage.css
│   │   │   ├── GamePage.jsx     # Main game interface
│   │   │   └── GamePage.css
│   │   ├── store/
│   │   │   └── gameStore.js     # Zustand state management
│   │   ├── utils/
│   │   │   └── translations.js  # Frontend translations
│   │   ├── App.jsx              # Root component
│   │   ├── App.css              # App styles
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── package.json
│
├── package.json                 # Backend dependencies
└── README.md                    # This file
```

## 🎨 Artworks Included

The game features 51 famous artworks including:
- Leonardo da Vinci (Mona Lisa, The Last Supper)
- Vincent van Gogh (Starry Night, Sunflowers)
- Pablo Picasso (Guernica, Les Demoiselles d'Avignon)
- Salvador Dali (Persistence of Memory)
- Johannes Vermeer (Girl with Pearl Earring)
- Sandro Botticelli (The Birth of Venus)
- Diego Velazquez (Las Meninas)
- And many more masterpieces!

## 🌐 Translations

The game supports:
- **English** 🇺🇸
- **Turkish** 🇹🇷

More languages can be easily added to `client/src/utils/translations.js` and `server/utils/translations.js`

## 🔧 Configuration

### Environment Variables

**.env** (root directory)
```
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Game Settings
Customizable in HomePage:
- Drawing Time: 30, 60, 90, or 120 seconds
- Max Rounds: 1, 3, or 5
- Max Players: 6 (hardcoded, can be changed in Game.js)

## 🚀 Deployment

### Heroku Deployment
```bash
# Build frontend
cd client && npm run build && cd ..

# Deploy
git push heroku main
```

### Docker
Create a Dockerfile in the root directory for containerized deployment.

## 🐛 Troubleshooting

### Connection Issues
- Ensure both frontend and backend are running
- Check CORS settings in server/index.js
- Verify firewall allows WebSocket connections

### Canvas Drawing Issues
- Clear browser cache if drawing tools not responding
- Try a different browser
- Ensure hardware acceleration is enabled

### Game Code Not Working
- Game codes are case-insensitive and 8 characters
- Ensure game creator hasn't left the session
- Create a new game if issues persist

## 📊 Performance

- Canvas drawing optimized with debouncing
- Efficient Socket.IO broadcasts
- Real-time updates with minimal latency
- Supports up to 6 players simultaneously

## 🔮 Future Enhancements

- [ ] AI-powered art suggestions
- [ ] Game replay system
- [ ] Custom artwork upload
- [ ] Mobile app (React Native)
- [ ] Advanced statistics dashboard
- [ ] Achievements/badges system
- [ ] Voice chat integration
- [ ] Private games with passwords
- [ ] Spectator mode
- [ ] Tournament mode

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**DenizTaylan51**
- GitHub: [@DenizTaylan51](https://github.com/DenizTaylan51)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📧 Contact & Support

For issues, questions, or suggestions:
1. Open a GitHub Issue
2. Check existing issues for solutions
3. Provide clear description and steps to reproduce

---

**Enjoy the game! 🎨✨**

Draw, guess, and have fun with friends!
