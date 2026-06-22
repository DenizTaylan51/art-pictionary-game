import { t } from '../utils/translations';
import './Leaderboard.css';

export default function Leaderboard({ scores, players, language = 'en' }) {
  const leaderboard = Object.entries(scores)
    .map(([playerId, score]) => {
      const player = players.find(p => p.id === playerId);
      return {
        name: player?.name || 'Unknown',
        score
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard">
      {leaderboard.length === 0 ? (
        <p className="empty">{t('waitingForPlayers', language)}</p>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <div key={index} className="leaderboard-entry">
              <span className="rank">#{index + 1}</span>
              <span className="name">{entry.name}</span>
              <span className="score">{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
