import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../utils/translations';
import './GuessingPanel.css';

export default function GuessingPanel({ artwork, isDrawer, language = 'en' }) {
  const [guess, setGuess] = useState('');
  const { submitGuess } = useGameStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim()) {
      submitGuess(guess);
      setGuess('');
    }
  };

  if (isDrawer) {
    return (
      <div className="guessing-panel">
        <div className="drawer-waiting">
          <h3>🎨 {t('youAreDrawing', language)}</h3>
          <p>{artwork?.title}</p>
          <p className="artist">{artwork?.artist}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guessing-panel">
      <h3>{t('guessArtwork', language)}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('guess', language)}
            autoComplete="off"
          />
          <button type="submit" className="btn-primary">
            {t('submit', language)}
          </button>
        </div>
      </form>
      <p className="hint">
        {t('artworkTitle', language)} {artwork?.title}
      </p>
    </div>
  );
}
