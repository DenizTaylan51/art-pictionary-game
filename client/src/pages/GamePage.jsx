import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../utils/translations';
import './GamePage.css';
import Canvas from '../components/Canvas';
import Leaderboard from '../components/Leaderboard';
import Timer from '../components/Timer';
import ArtworkPreview from '../components/ArtworkPreview';
import GuessingPanel from '../components/GuessingPanel';

export default function GamePage() {
  const {
    gameId,
    playerName,
    language,
    gameState,
    startGame,
    setCurrentPage
  } = useGameStore();

  const isDrawer = gameState.drawer?.name === playerName;

  return (
    <div className="game-page">
      <div className="game-container">
        {/* Header with game info */}
        <div className="game-header">
          <div className="game-info">
            <h2>
              {t('round', language)} {gameState.round} {t('of', language)} {gameState.maxRounds}
            </h2>
            <p>{t('gameCode', language)} {gameId}</p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => setCurrentPage('home')}
          >
            {t('backHome', language)}
          </button>
        </div>

        {/* Main game area */}
        <div className="game-content">
          {/* Left side - Canvas/Preview */}
          <div className="game-main">
            {gameState.state === 'preview' && (
              <ArtworkPreview artwork={gameState.currentArtwork} />
            )}
            {gameState.state === 'drawing' && (
              <div className="drawing-section">
                {isDrawer ? (
                  <>
                    <div className="drawer-info">
                      <h3>{t('youAreDrawing', language)}</h3>
                      <p>{gameState.currentArtwork?.title}</p>
                      <p className="artist">{gameState.currentArtwork?.artist}</p>
                    </div>
                    <Canvas />
                  </>
                ) : (
                  <>
                    <div className="viewer-info">
                      <p>{t('waitingForDrawer', language)}</p>
                      <p className="drawer-name">
                        {gameState.drawer?.name} {t('youAreDrawing', language).toLowerCase()}
                      </p>
                    </div>
                    <Canvas isViewer={true} />
                  </>
                )}
              </div>
            )}
            {gameState.state === 'guessing' && (
              <div className="guessing-section">
                <GuessingPanel artwork={gameState.currentArtwork} isDrawer={isDrawer} />
                {!isDrawer && <Canvas isViewer={true} />}
              </div>
            )}
            {gameState.state === 'waiting' && (
              <div className="waiting-section">
                <h3>{t('waitingForPlayers', language)}</h3>
                <div className="players-list">
                  {gameState.players.map(player => (
                    <div key={player.id} className="player-item">
                      {player.name}
                    </div>
                  ))}
                </div>
                <button
                  className="btn-primary btn-large"
                  onClick={startGame}
                  disabled={gameState.players.length < 2}
                >
                  {t('startGame', language)}
                </button>
              </div>
            )}
            {gameState.state === 'finished' && (
              <div className="finished-section">
                <h3>{t('roundComplete', language)}</h3>
                <button className="btn-primary">
                  {t('nextRound', language)}
                </button>
              </div>
            )}
          </div>

          {/* Right side - Sidebar */}
          <div className="game-sidebar">
            <div className="sidebar-section">
              <h4>{t('players', language)}</h4>
              <div className="players-panel">
                {gameState.players.map(player => (
                  <div key={player.id} className="player-item">
                    <span>{player.name}</span>
                    {gameState.drawer?.id === player.id && (
                      <span className="drawer-badge">🎨</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h4>{t('leaderboard', language)}</h4>
              <Leaderboard scores={gameState.scores} players={gameState.players} />
            </div>

            {gameState.state === 'drawing' && (
              <div className="sidebar-section">
                <Timer initialTime={gameState.settings?.drawingTime || 60} />
              </div>
            )}
            {gameState.state === 'guessing' && (
              <div className="sidebar-section">
                <Timer initialTime={30} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
