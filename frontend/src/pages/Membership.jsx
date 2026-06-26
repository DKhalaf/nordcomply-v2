import React, { useState, useEffect } from 'react';

const membershipStyles = `
  .membership {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .membership h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary, #1f2937);
    margin-bottom: 8px;
  }

  .membership-subtitle {
    color: var(--text-secondary, #4b5563);
    margin-bottom: 24px;
    font-size: 15px;
  }

  .membership-table-container {
    background: white;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .membership-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .membership-table thead {
    background-color: var(--bg-light, #f9fafb);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .membership-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary, #1f2937);
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .membership-table tbody tr {
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    transition: background-color 0.2s;
  }

  .membership-table tbody tr:hover {
    background-color: var(--bg-light, #f9fafb);
  }

  .membership-table td {
    padding: 12px 16px;
    color: var(--text-secondary, #4b5563);
  }

  .user-email {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: var(--text-secondary, #4b5563);
  }

  .group-badge {
    display: inline-block;
    background: var(--bg-light, #f9fafb);
    color: var(--text-secondary, #4b5563);
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid var(--border-color, #e5e7eb);
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .groups-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .membership-empty {
    text-align: center;
    padding: 48px 32px;
    color: var(--text-secondary, #4b5563);
  }

  .membership-error {
    background: #fee2e2;
    color: #7f1d1d;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #fecaca;
  }

  .membership-loading {
    text-align: center;
    color: var(--text-secondary, #4b5563);
    padding: 32px;
  }
`;

export default function Membership({ tenantId, tenantName }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembership = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://nordcomply-api.dshvan5.workers.dev/api/membership?tenantId=${tenantId}`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setUsers(data.users || []);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
      setLoading(false);
    };

    fetchMembership();
  }, [tenantId]);

  return (
    <div className="membership">
      <style>{membershipStyles}</style>
      <div>
        <h2>Membership - {tenantName}</h2>
        <p className="membership-subtitle">Users and their group memberships</p>
      </div>

      {loading && <p className="membership-loading">Indlæser...</p>}

      {error && <div className="membership-error">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className="membership-empty">
          <p>No users found</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="membership-table-container">
          <table className="membership-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Groups</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName || 'N/A'}</td>
                  <td className="user-email">{user.userPrincipalName || user.mail || 'N/A'}</td>
                  <td>
                    {user.groups && user.groups.length > 0 ? (
                      <div className="groups-container">
                        {user.groups.map((group) => (
                          <span key={group.id} className="group-badge">
                            {group.displayName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted, #9ca3af)' }}>No groups</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}