import React, { useState, useEffect } from 'react';
import './styles.css';

export default function SecureScore({ tenantId, tenantName }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://nordcomply-api.dshvan5.workers.dev/api/secure-score?tenantId=${tenantId}`
        );
        const data = await response.json();

        if (data.error) {
          setError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        } else if (data.currentScore === undefined) {
          setError('Secure Score data not available');
        } else {
          setScore(data);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
      setLoading(false);
    };

    fetchScore();
  }, [tenantId]);

  return (
    <div className="secure-score">
      <div>
        <h2>Microsoft 365 Secure Score - {tenantName}</h2>
        <p className="score-subtitle">Security posture across Microsoft 365 services</p>
      </div>

      {loading && <p className="score-loading">Indlæser...</p>}
      {error && <div className="score-error">{error}</div>}

      {score && !loading && (
        <div className="score-container">
          <div className="score-card">
            <h3>Current Score</h3>
            <div className="score-display">
              <div className="score-number">{score.currentScore}</div>
              <div className="score-max">/ {score.maxScore}</div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(score.currentScore / score.maxScore) * 100}%`,
                }}
              />
            </div>
            <p className="percentage">
              {((score.currentScore / score.maxScore) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}