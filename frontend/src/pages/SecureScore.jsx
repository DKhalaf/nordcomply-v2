import React, { useState, useEffect } from 'react';

const secureScoreStyles = `
  .secure-score {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .secure-score h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary, #1f2937);
    margin-bottom: 8px;
  }

  .score-subtitle {
    color: var(--text-secondary, #4b5563);
    margin-bottom: 24px;
    font-size: 15px;
  }

  .score-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .score-card {
    background: white;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 24px;
  }

  .score-card h3 {
    font-size: 13px;
    color: var(--text-muted, #9ca3af);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .score-display {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 24px;
  }

  .score-number {
    font-size: 48px;
    font-weight: 700;
    color: var(--primary-color, #2563eb);
  }

  .score-max {
    font-size: 20px;
    color: var(--text-muted, #9ca3af);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-light, #f9fafb);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color, #2563eb), #60a5fa);
    transition: width 0.3s ease;
  }

  .percentage {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary, #1f2937);
  }

  .details-card {
    background: white;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 24px;
  }

  .details-card h4 {
    font-size: 13px;
    color: var(--text-muted, #9ca3af);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .details-card pre {
    background: var(--bg-light, #f9fafb);
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
    max-height: 400px;
    color: var(--text-primary, #1f2937);
    border: 1px solid var(--border-color, #e5e7eb);
    font-family: 'Courier New', monospace;
  }

  .score-error {
    background: #fee2e2;
    color: #7f1d1d;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #fecaca;
  }

  .score-loading {
    text-align: center;
    color: var(--text-secondary, #4b5563);
    padding: 32px;
  }
`;

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
          setError(data.error);
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

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'var(--primary-color, #2563eb)';
    if (percentage >= 60) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="secure-score">
      <style>{secureScoreStyles}</style>
      <div>
        <h2>Secure Score - {tenantName}</h2>
        <p className="score-subtitle">Microsoft 365 security posture</p>
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
                  backgroundColor: getScoreColor(
                    (score.currentScore / score.maxScore) * 100
                  ),
                }}
              />
            </div>

            <p className="percentage">
              {((score.currentScore / score.maxScore) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="details-card">
            <h4>Details</h4>
            <pre>{JSON.stringify(score, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}