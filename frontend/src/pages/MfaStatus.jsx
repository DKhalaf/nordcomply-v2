import React, { useState, useEffect } from 'react';
import './styles.css';

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
          setError(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
        } else if (result.totalUsers === undefined) {
          setError('MFA data not available');
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

          {data.users && data.users.length > 0 ? (
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
          ) : (
            <div className="mfa-empty">No users found</div>
          )}
        </>
      )}
    </div>
  );
}