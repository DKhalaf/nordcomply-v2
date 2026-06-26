import React, { useState, useEffect } from 'react';
import './styles.css';

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
          setError(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
        } else if (result.totalPolicies === undefined) {
          setError('Conditional Access data not available');
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

          {data.policies && data.policies.length === 0 ? (
            <div className="ca-empty">
              <p>Ingen Conditional Access policies konfigureret</p>
            </div>
          ) : data.policies && data.policies.length > 0 ? (
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
                        {policy.conditions.platforms && policy.conditions.platforms.length > 0
                          ? policy.conditions.platforms.join(', ')
                          : 'Alle'}
                      </div>
                    </div>
                    <div className="ca-detail-item">
                      <div className="ca-detail-label">Grant Controls</div>
                      <div className="ca-detail-value">
                        {policy.grantControls && policy.grantControls.builtInControls && policy.grantControls.builtInControls.length > 0
                          ? policy.grantControls.builtInControls.join(', ')
                          : 'Ingen'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}