import { create } from 'zustand';
import io from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const useGameStore = create((set, get) => ({
  // Connection
  socket: null,
  connected: false,

  // Game State
  gameId: null,
  playerId: null,
  playerName: null,
  language: 'en',
  gameState: {
    state: 'waiting',
    players: [],
    drawer: null,
    currentArtwork: null,
    round: 0,
    maxRounds: 3,
    scores: {}
  },

  // Canvas
  canvas: null,
  ctx: null,
  isDrawing: false,
  brush: {
    size: 5,
    color: '#000000',
    tool: 'pen' // pen, eraser
  },
  history: [],
  historyStep: 0,

  // UI State
  currentPage: 'home', // home, create, join, game
  gameSettings: {
    drawingTime: 60,
    maxRounds: 3,
    maxPlayers: 6
  },

  // Initialize Socket
  initSocket: () => {
    const socket = io(SERVER_URL);
    
    socket.on('connect', () => {
      set({ connected: true });
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      set({ connected: false });
    });

    socket.on('game-state', (newState) => {
      set({ gameState: newState });
    });

    socket.on('player-joined', (data) => {
      set(state => ({
        gameState: {
          ...state.gameState,
          players: data.players
        }
      }));
    });

    socket.on('player-left', (data) => {
      set(state => ({
        gameState: {
          ...state.gameState,
          players: data.players
        }
      }));
    });

    socket.on('artwork-preview', (data) => {
      set(state => ({
        gameState: {
          ...state.gameState,
          currentArtwork: data.artwork,
          drawer: data.drawer
        }
      }));
    });

    socket.on('drawing-start', (data) => {
      set(state => ({
        gameState: {
          ...state.gameState,
          state: 'drawing',
          currentArtwork: data.artwork,
          drawer: data.drawer
        }
      }));
    });

    socket.on('guessing-start', () => {
      set(state => ({
        gameState: {
          ...state.gameState,
          state: 'guessing'
        }
      }));
    });

    socket.on('correct-guess', (data) => {
      console.log(`${data.playerName} guessed correctly! +${data.points} points`);
    });

    socket.on('round-end', (data) => {
      set(state => ({
        gameState: {
          ...state.gameState,
          state: 'finished'
        }
      }));
    });

    socket.on('game-over', (data) => {
      set(state => ({
        gameState: {
          ...state.gameState,
          state: 'finished'
        }
      }));
    });

    socket.on('draw', (drawData) => {
      if (get().canvas) {
        const ctx = get().ctx;
        redrawCanvas(drawData, ctx);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error.message);
    });

    set({ socket });
  },

  // Game Actions
  createGame: async (settings) => {
    const response = await fetch(`${SERVER_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await response.json();
    set({ 
      gameId: data.gameId,
      gameSettings: settings,
      currentPage: 'game'
    });
    return data.gameId;
  },

  joinGame: (gameId, playerId, playerName) => {
    const socket = get().socket;
    socket.emit('join-game', {
      gameId,
      playerId,
      playerName
    });
    set({
      gameId,
      playerId,
      playerName,
      currentPage: 'game'
    });
  },

  startGame: () => {
    const socket = get().socket;
    const gameId = get().gameId;
    socket.emit('start-game', { gameId });
  },

  // Canvas Actions
  setCanvas: (canvas) => {
    const ctx = canvas.getContext('2d');
    set({ canvas, ctx });
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(canvas);
  },

  setBrush: (brushSettings) => {
    set(state => ({
      brush: { ...state.brush, ...brushSettings }
    }));
  },

  startDrawing: (x, y) => {
    const ctx = get().ctx;
    const brush = get().brush;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    set({ isDrawing: true });
  },

  draw: (x, y) => {
    if (!get().isDrawing) return;
    
    const ctx = get().ctx;
    const brush = get().brush;
    
    ctx.lineWidth = brush.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (brush.tool === 'eraser') {
      ctx.clearRect(x - brush.size/2, y - brush.size/2, brush.size, brush.size);
    } else {
      ctx.strokeStyle = brush.color;
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Send drawing data to other players
    const socket = get().socket;
    const gameId = get().gameId;
    socket.emit('draw', {
      gameId,
      drawData: {
        x,
        y,
        size: brush.size,
        color: brush.color,
        tool: brush.tool
      }
    });
  },

  stopDrawing: () => {
    const ctx = get().ctx;
    ctx.closePath();
    set({ isDrawing: false });
    saveToHistory(get().canvas);
  },

  undo: () => {
    const history = get().history;
    let step = get().historyStep;
    
    if (step > 0) {
      step--;
      const canvas = get().canvas;
      const ctx = get().ctx;
      const imageData = history[step];
      ctx.putImageData(imageData, 0, 0);
      set({ historyStep: step });
    }

    const socket = get().socket;
    const gameId = get().gameId;
    socket.emit('undo', { gameId });
  },

  redo: () => {
    const history = get().history;
    let step = get().historyStep;
    
    if (step < history.length - 1) {
      step++;
      const canvas = get().canvas;
      const ctx = get().ctx;
      const imageData = history[step];
      ctx.putImageData(imageData, 0, 0);
      set({ historyStep: step });
    }

    const socket = get().socket;
    const gameId = get().gameId;
    socket.emit('redo', { gameId });
  },

  clearCanvas: () => {
    const canvas = get().canvas;
    const ctx = get().ctx;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(canvas);

    const socket = get().socket;
    const gameId = get().gameId;
    socket.emit('clear-canvas', { gameId });
  },

  // Guess Actions
  submitGuess: (guess) => {
    const socket = get().socket;
    const gameId = get().gameId;
    const playerId = get().playerId;
    
    socket.emit('guess', {
      gameId,
      playerId,
      guess
    });
  },

  setLanguage: (language) => {
    set({ language });
    localStorage.setItem('language', language);
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  }
}));

// Helper function to save canvas state to history
function saveToHistory(canvas) {
  const store = useGameStore.getState();
  const ctx = store.ctx;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  let history = store.history.slice(0, store.historyStep + 1);
  history.push(imageData);
  
  if (history.length > 50) {
    history = history.slice(-50);
  }
  
  useGameStore.setState({
    history,
    historyStep: history.length - 1
  });
}

function redrawCanvas(drawData, ctx) {
  if (drawData.tool === 'eraser') {
    ctx.clearRect(
      drawData.x - drawData.size/2,
      drawData.y - drawData.size/2,
      drawData.size,
      drawData.size
    );
  } else {
    ctx.lineWidth = drawData.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawData.color;
    ctx.lineTo(drawData.x, drawData.y);
    ctx.stroke();
  }
}
