import { getRandomArtwork } from '../data/artworks.js';

export class Game {
  constructor(gameId, maxPlayers = 6) {
    this.gameId = gameId;
    this.maxPlayers = maxPlayers;
    this.players = new Map();
    this.state = 'waiting'; // waiting, preview, drawing, guessing, finished
    this.currentArtwork = null;
    this.drawer = null;
    this.round = 0;
    this.maxRounds = 3;
    this.drawingTime = 60; // seconds
    this.previewTime = 15; // seconds
    this.guesses = new Map();
    this.scores = new Map();
    this.startTime = null;
    this.settings = {
      drawingTime: 60,
      language: 'en',
      maxRounds: 3
    };
  }

  addPlayer(playerId, playerName, socketId) {
    if (this.players.size >= this.maxPlayers) {
      return false;
    }
    
    this.players.set(playerId, {
      id: playerId,
      name: playerName,
      socketId: socketId,
      score: 0,
      guesses: [],
      isDrawing: false,
      hasGuessed: false
    });
    
    if (!this.scores.has(playerId)) {
      this.scores.set(playerId, 0);
    }
    
    return true;
  }

  removePlayer(playerId) {
    if (this.drawer && this.drawer.id === playerId) {
      this.drawer = null;
    }
    this.players.delete(playerId);
    this.scores.delete(playerId);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  setDrawer(playerId) {
    if (this.players.has(playerId)) {
      this.drawer = this.players.get(playerId);
      this.drawer.isDrawing = true;
      return true;
    }
    return false;
  }

  selectRandomDrawer() {
    const playerArray = this.getPlayers();
    if (playerArray.length === 0) return null;
    
    const randomDrawer = playerArray[Math.floor(Math.random() * playerArray.length)];
    this.setDrawer(randomDrawer.id);
    return randomDrawer;
  }

  selectNextArtwork() {
    this.currentArtwork = getRandomArtwork();
    return this.currentArtwork;
  }

  addGuess(playerId, guess) {
    if (!this.guesses.has(playerId)) {
      this.guesses.set(playerId, []);
    }
    this.guesses.get(playerId).push({
      guess: guess,
      timestamp: Date.now(),
      correct: this.isCorrectGuess(guess)
    });
    
    return this.guesses.get(playerId)[this.guesses.get(playerId).length - 1];
  }

  isCorrectGuess(guess) {
    if (!this.currentArtwork) return false;
    
    const normalized = guess.toLowerCase().trim();
    const title = this.currentArtwork.title.toLowerCase();
    const artist = this.currentArtwork.artist.toLowerCase();
    
    return normalized.includes(title) || normalized.includes(artist);
  }

  addPoints(playerId, points) {
    const currentScore = this.scores.get(playerId) || 0;
    this.scores.set(playerId, currentScore + points);
  }

  getLeaderboard() {
    return Array.from(this.scores.entries())
      .map(([playerId, score]) => ({
        playerId,
        playerName: this.players.get(playerId)?.name || 'Unknown',
        score
      }))
      .sort((a, b) => b.score - a.score);
  }

  resetRound() {
    this.guesses.clear();
    this.players.forEach(player => {
      player.hasGuessed = false;
      player.isDrawing = false;
    });
    this.currentArtwork = null;
    this.drawer = null;
  }

  getGameState() {
    return {
      gameId: this.gameId,
      state: this.state,
      players: this.getPlayers(),
      drawer: this.drawer,
      currentArtwork: this.currentArtwork ? {
        title: this.currentArtwork.title,
        artist: this.currentArtwork.artist,
        difficulty: this.currentArtwork.difficulty
      } : null,
      round: this.round,
      maxRounds: this.maxRounds,
      scores: Object.fromEntries(this.scores),
      settings: this.settings
    };
  }

  isReady() {
    return this.players.size > 1;
  }

  isFull() {
    return this.players.size >= this.maxPlayers;
  }

  isEmpty() {
    return this.players.size === 0;
  }

  incrementRound() {
    this.round++;
  }

  isGameOver() {
    return this.round >= this.maxRounds;
  }
}
