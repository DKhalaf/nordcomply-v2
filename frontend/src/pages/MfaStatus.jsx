import React, { useState, useEffect } from 'react';

const mfaStyles = `
  .mfa-status {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .mfa-status h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary, #1f2937);
    margin-bottom: 8px;
  }

  .mfa-subtitle {
    color: var(--text-secondary, #4b5563);
    margin-bottom: 24px;
    font-size: 15px;
  }

  .mfa-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .mfa-stat-card {
    background: var(--bg-light, #f9fafb);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 20px;
  }

  .mfa-stat-label {
    font-size: 13px;
    color: var(--text-muted, #9ca3af);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .mfa-stat-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary-color, #2563eb);
  }

  .mfa-table-container {
    background: white;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mfa-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .mfa-table thead {
    background-color: var(--bg-light, #f9fafb);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .mfa-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary, #1f2937);
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .mfa-table tbody tr {
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    transition: background-color 0.2s;
  }

  .mfa-table tbody tr:hover {
    background-color: var(--bg-light, #f9fafb);
  }

  .mfa-table td {
    padding: 12px 16px;
    color: var(--text-secondary, #4b5563);
  }

  .mfa-badge-enabled {
    display: inline-block;
    background-color: #d1fae5;
    color: #065f46;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .mfa-badge-disabled {
    display: inline-block;
    background-color: #fee2e2;
    color: #7f1d1d;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .mfa-error {
    background: #fee2e2;
    color: #7f1d1d;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #fecaca;
  }

  .mfa-loading {
    text-align: center;
    color: var(--text-secondary, #4b5563);
    padding: 32px;
  }
`;

export default function MfaStatus({ tenantId, tenantName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMfaStatus = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://nordcomply-api.dshvan5.workers.dev/api/mfa-status?tenantId=${tenantId}`
        );
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
      setLoading(false);
    };

    fetchMfaStatus();
  }, [tenantId]);

  return (
    <div className="mfa-status">
      <style>{mfaStyles}</style>
      <div>
        <h2>MFA Status - {tenantName}</h2>
        <p className="mfa-subtitle">Multi-factor authentication adoption across users</p>
      </div>

      {loading && <p className="mfa-loading">Indlæser...</p>}

      {error && <div className="mfa-error">{error}</div>}

      {data && !loading && (
        <>
          <div className="mfa-stats">
            <div className="mfa-stat-card">
              <div className="mfa-stat-label">Total Brugere</div>
              <div className="mfa-stat-value">{data.totalUsers}</div>
            </div>
            <div className="mfa-stat-card">
              <div className="mfa-stat-label">MFA Aktiveret</div>
              <div className="mfa-stat-value">{data.mfaEnabledCount}</div>
            </div>
            <div className="mfa-stat-card">
              <div className="mfa-stat-label">Coverage %</div>
              <div className="mfa-stat-value">{data.mfaPercentage}%</div>
            </div>
          </div>

          {data.users.length > 0 && (
            <div className="mfa-table-container">
              <table className="mfa-table">
                <thead>
                  <tr>
                    <th>Bruger</th>
                    <th>Email</th>
                    <th>MFA Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.displayName || 'N/A'}</td>
                      <td>{user.userPrincipalName || user.mail || 'N/A'}</td>
                      <td>
                        {user.hasMfa ? (
                          <span className="mfa-badge-enabled">✓ Aktiveret</span>
                        ) : (
                          <span className="mfa-badge-disabled">✗ Deaktiveret</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}