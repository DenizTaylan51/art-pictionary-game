import { useEffect, useState } from 'react';
import './Timer.css';

export default function Timer({ initialTime }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime]);

  const percentage = (timeLeft / initialTime) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="timer">
      <div className={`timer-display ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
        {timeLeft}s
      </div>
      <div className="timer-bar">
        <div
          className={`timer-progress ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
