import React, { useState, useEffect } from 'react';

const caStyles = `
  .conditional-access {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .conditional-access h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary, #1f2937);
    margin-bottom: 8px;
  }

  .ca-subtitle {
    color: var(--text-secondary, #4b5563);
    margin-bottom: 24px;
    font-size: 15px;
  }

  .ca-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .ca-stat-card {
    background: var(--bg-light, #f9fafb);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 20px;
  }

  .ca-stat-label {
    font-size: 13px;
    color: var(--text-muted, #9ca3af);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .ca-stat-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary-color, #2563eb);
  }

  .ca-policies-container {
    display: grid;
    gap: 20px;
  }

  .ca-policy-card {
    background: white;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 20px;
  }

  .ca-policy-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 16px;
  }

  .ca-policy-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary, #1f2937);
  }

  .ca-state-badge-enabled {
    background-color: #d1fae5;
    color: #065f46;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .ca-state-badge-disabled {
    background-color: #fee2e2;
    color: #7f1d1d;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .ca-policy-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .ca-detail-item {
    background: var(--bg-light, #f9fafb);
    padding: 12px;
    border-radius: 6px;
  }

  .ca-detail-label {
    font-size: 12px;
    color: var(--text-muted, #9ca3af);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .ca-detail-value {
    font-size: 14px;
    color: var(--text-primary, #1f2937);
    font-weight: 500;
  }

  .ca-error {
    background: #fee2e2;
    color: #7f1d1d;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #fecaca;
  }

  .ca-loading {
    text-align: center;
    color: var(--text-secondary, #4b5563);
    padding: 32px;
  }

  .ca-empty {
    text-align: center;
    padding: 48px 32px;
    color: var(--text-muted, #9ca3af);
  }
`;

export default function ConditionalAccess({ tenantId, tenantName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConditionalAccess = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://nordcomply-api.dshvan5.workers.dev/api/conditional-access?tenantId=${tenantId}`
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

    fetchConditionalAccess();
  }, [tenantId]);

  return (
    <div className="conditional-access">
      <style>{caStyles}</style>
      <div>
        <h2>Conditional Access - {tenantName}</h2>
        <p className="ca-subtitle">Conditional Access policies and their configurations</p>
      </div>

      {loading && <p className="ca-loading">Indlæser...</p>}

      {error && <div className="ca-error">{error}</div>}

      {data && !loading && (
        <>
          <div className="ca-stats">
            <div className="ca-stat-card">
              <div className="ca-stat-label">Samlede Politikker</div>
              <div className="ca-stat-value">{data.totalPolicies}</div>
            </div>
            <div className="ca-stat-card">
              <div className="ca-stat-label">Aktiverede Politikker</div>
              <div className="ca-stat-value">{data.enabledPolicies}</div>
            </div>
          </div>

          {data.policies.length === 0 ? (
            <div className="ca-empty">
              <p>Ingen Conditional Access policies konfigureret</p>
            </div>
          ) : (
            <div className="ca-policies-container">
              {data.policies.map((policy) => (
                <div key={policy.id} className="ca-policy-card">
                  <div className="ca-policy-header">
                    <div className="ca-policy-name">{policy.displayName}</div>
                    <div>
                      {policy.state === 'enabled' ? (
                        <span className="ca-state-badge-enabled">Aktiveret</span>
                      ) : (
                        <span className="ca-state-badge-disabled">Deaktiveret</span>
                      )}
                    </div>
                  </div>

                  <div className="ca-policy-details">
                    <div className="ca-detail-item">
                      <div className="ca-detail-label">Applikationer</div>
                      <div className="ca-detail-value">{policy.conditions.applications}</div>
                    </div>
                    <div className="ca-detail-item">
                      <div className="ca-detail-label">Brugere</div>
                      <div className="ca-detail-value">{policy.conditions.users}</div>
                    </div>
                    <div className="ca-detail-item">
                      <div className="ca-detail-label">Platforme</div>
                      <div className="ca-detail-value">
                        {policy.conditions.platforms.length > 0
                          ? policy.conditions.platforms.join(', ')
                          : 'Alle'}
                      </div>
                    </div>
                    <div className="ca-detail-item">
                      <div className="ca-detail-label">Grant Controls</div>
                      <div className="ca-detail-value">
                        {policy.grantControls.builtInControls.length > 0
                          ? policy.grantControls.builtInControls.join(', ')
                          : 'Ingen'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}