import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Game } from './models/Game.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store games
const games = new Map();
const playerSockets = new Map(); // playerId -> socketId mapping

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/games', (req, res) => {
  const { maxPlayers = 6, drawingTime = 60, language = 'en', maxRounds = 3 } = req.body;
  
  const gameId = uuidv4().substring(0, 8).toUpperCase();
  const game = new Game(gameId, maxPlayers);
  game.settings = {
    drawingTime,
    language,
    maxRounds
  };
  game.maxRounds = maxRounds;
  game.drawingTime = drawingTime;
  
  games.set(gameId, game);
  
  res.json({ gameId, game: game.getGameState() });
});

app.get('/api/games/:gameId', (req, res) => {
  const { gameId } = req.params;
  const game = games.get(gameId);
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.json({ game: game.getGameState() });
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game', (data) => {
    const { gameId, playerId, playerName } = data;
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    if (!game.addPlayer(playerId, playerName, socket.id)) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }
    
    playerSockets.set(playerId, socket.id);
    socket.join(gameId);
    
    // Notify all players
    io.to(gameId).emit('game-state', game.getGameState());
    io.to(gameId).emit('player-joined', {
      playerName,
      players: game.getPlayers()
    });
  });

  socket.on('start-game', (data) => {
    const { gameId } = data;
    const game = games.get(gameId);
    
    if (!game || game.state !== 'waiting') {
      socket.emit('error', { message: 'Cannot start game' });
      return;
    }
    
    if (!game.isReady()) {
      socket.emit('error', { message: 'Not enough players' });
      return;
    }
    
    startRound(gameId);
  });

  socket.on('draw', (data) => {
    const { gameId, drawData } = data;
    const game = games.get(gameId);
    
    if (!game || game.state !== 'drawing') {
      return;
    }
    
    // Broadcast drawing data to all players except drawer
    socket.to(gameId).emit('draw', drawData);
  });

  socket.on('guess', (data) => {
    const { gameId, playerId, guess } = data;
    const game = games.get(gameId);
    
    if (!game || game.state !== 'guessing') {
      return;
    }
    
    const guessResult = game.addGuess(playerId, guess);
    
    if (guessResult.correct) {
      const player = game.players.get(playerId);
      const timeElapsed = Date.now() - game.startTime;
      const timeBased = Math.max(10, 100 - Math.floor(timeElapsed / 100));
      
      game.addPoints(playerId, timeBased);
      
      io.to(gameId).emit('correct-guess', {
        playerName: player.name,
        points: timeBased
      });
    }
  });

  socket.on('undo', (data) => {
    const { gameId } = data;
    socket.to(gameId).emit('undo');
  });

  socket.on('redo', (data) => {
    const { gameId } = data;
    socket.to(gameId).emit('redo');
  });

  socket.on('clear-canvas', (data) => {
    const { gameId } = data;
    socket.to(gameId).emit('clear-canvas');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find game and remove player
    for (const [gameId, game] of games.entries()) {
      for (const [playerId, player] of game.players) {
        if (player.socketId === socket.id) {
          game.removePlayer(playerId);
          playerSockets.delete(playerId);
          
          if (game.isEmpty()) {
            games.delete(gameId);
          } else {
            io.to(gameId).emit('game-state', game.getGameState());
            io.to(gameId).emit('player-left', {
              playerName: player.name,
              players: game.getPlayers()
            });
          }
          break;
        }
      }
    }
  });
});

// Helper Functions
function startRound(gameId) {
  const game = games.get(gameId);
  if (!game) return;
  
  if (game.isGameOver()) {
    endGame(gameId);
    return;
  }
  
  game.resetRound();
  game.incrementRound();
  game.selectRandomDrawer();
  game.selectNextArtwork();
  
  // Preview phase
  game.state = 'preview';
  io.to(gameId).emit('game-state', game.getGameState());
  io.to(gameId).emit('artwork-preview', {
    artwork: game.currentArtwork,
    drawer: game.drawer
  });
  
  // Transition to drawing after preview time
  setTimeout(() => {
    if (games.has(gameId)) {
      game.state = 'drawing';
      game.startTime = Date.now();
      io.to(gameId).emit('game-state', game.getGameState());
      io.to(gameId).emit('drawing-start', {
        artwork: game.currentArtwork,
        drawer: game.drawer,
        drawingTime: game.drawingTime
      });
      
      // Transition to guessing after drawing time
      setTimeout(() => {
        if (games.has(gameId)) {
          game.state = 'guessing';
          io.to(gameId).emit('game-state', game.getGameState());
          io.to(gameId).emit('guessing-start', {
            drawingTime: game.drawingTime
          });
          
          // End round after guessing time
          setTimeout(() => {
            if (games.has(gameId)) {
              io.to(gameId).emit('round-end', {
                leaderboard: game.getLeaderboard()
              });
              
              // Start next round
              setTimeout(() => {
                startRound(gameId);
              }, 3000);
            }
          }, 30000); // 30 seconds for guessing
        }
      }, game.drawingTime * 1000);
    }
  }, game.previewTime * 1000);
}

function endGame(gameId) {
  const game = games.get(gameId);
  if (!game) return;
  
  game.state = 'finished';
  io.to(gameId).emit('game-over', {
    leaderboard: game.getLeaderboard()
  });
}

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
