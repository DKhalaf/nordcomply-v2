import React, { useState, useEffect } from 'react';
import './styles.css';

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
          setError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        } else {
          setUsers(Array.isArray(data.users) ? data.users : []);
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
                      <span className="no-groups">No groups</span>
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