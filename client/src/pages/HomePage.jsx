import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../utils/translations';
import './HomePage.css';

export default function HomePage() {
  const { language, createGame, setCurrentPage, playerId } = useGameStore();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [drawingTime, setDrawingTime] = useState(60);
  const [maxRounds, setMaxRounds] = useState(3);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      alert(t('playerName', language));
      return;
    }

    const settings = {
      drawingTime,
      maxRounds,
      language
    };

    try {
      const newGameId = await createGame(settings);
      useGameStore.setState({
        playerId: playerId || `player_${Date.now()}`,
        playerName
      });
      setCurrentPage('game');
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleJoinGame = () => {
    if (!gameCode.trim()) {
      alert(t('gameCode', language));
      return;
    }
    if (!playerName.trim()) {
      alert(t('playerName', language));
      return;
    }

    const { joinGame } = useGameStore.getState();
    joinGame(
      gameCode.toUpperCase(),
      playerId || `player_${Date.now()}`,
      playerName
    );
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="welcome-section">
          <h2>{t('appTitle', language)}</h2>
          <p>{t('appSubtitle', language)}</p>
        </div>

        {!showCreate && !showJoin && (
          <div className="button-group">
            <button
              className="btn-primary btn-large"
              onClick={() => setShowCreate(true)}
            >
              {t('createGame', language)}
            </button>
            <button
              className="btn-secondary btn-large"
              onClick={() => setShowJoin(true)}
            >
              {t('joinGame', language)}
            </button>
          </div>
        )}

        {showCreate && (
          <div className="form-section">
            <h3>{t('gameSettings', language)}</h3>

            <div className="form-group">
              <label>{t('playerName', language)}</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t('playerName', language)}
              />
            </div>

            <div className="form-group">
              <label>{t('drawingTime', language)}</label>
              <select value={drawingTime} onChange={(e) => setDrawingTime(Number(e.target.value))}>
                <option value={30}>{t('30s', language)}</option>
                <option value={60}>{t('60s', language)}</option>
                <option value={90}>{t('90s', language)}</option>
                <option value={120}>{t('120s', language)}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('maxRounds', language)}</label>
              <select value={maxRounds} onChange={(e) => setMaxRounds(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleCreateGame}>
                {t('startGame', language)}
              </button>
              <button className="btn-secondary" onClick={() => setShowCreate(false)}>
                {t('backHome', language)}
              </button>
            </div>
          </div>
        )}

        {showJoin && (
          <div className="form-section">
            <h3>{t('joinGame', language)}</h3>

            <div className="form-group">
              <label>{t('gameCode', language)}</label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="XXXX"
                maxLength={8}
              />
            </div>

            <div className="form-group">
              <label>{t('playerName', language)}</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t('playerName', language)}
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleJoinGame}>
                {t('joinButton', language)}
              </button>
              <button className="btn-secondary" onClick={() => setShowJoin(false)}>
                {t('backHome', language)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
