import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

const API_BASE = 'https://nordcomply-api.dshvan5.workers.dev';

export default function TenantDetail() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchTenantData();
  }, [tenantId]);

  async function fetchTenantData() {
    try {
      setLoading(true);
      
      // Fetch all tenants to find the one we need
      const tenantsRes = await fetch(`${API_BASE}/api/tenants`);
      if (!tenantsRes.ok) throw new Error('Failed to fetch tenants');
      const tenants = await tenantsRes.json();
      const foundTenant = tenants.find(t => t.id === tenantId);
      
      if (!foundTenant) throw new Error('Tenant not found');
      setTenant(foundTenant);

      // Fetch user data from Graph API
      const scoreRes = await fetch(
        `${API_BASE}/api/secure-score?tenantId=${foundTenant.tenantId}`
      );
      if (scoreRes.ok) {
        const data = await scoreRes.json();
        setUserData(data);
      }

      // Fetch membership data
      const membershipRes = await fetch(
        `${API_BASE}/api/membership?tenantId=${foundTenant.tenantId}`
      );
      if (membershipRes.ok) {
        const membershipData = await membershipRes.json();
        setUsers(membershipData.users || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Indlæser...</div>;
  if (error) return <div className="error">Fejl: {error}</div>;
  if (!tenant) return <div className="error">Tenant not found</div>;

  return (
    <div className="tenant-detail">
      <button onClick={() => navigate('/tenants')} className="btn-back">
        ← Tilbage til tenants
      </button>

      <div className="detail-header">
        <h1>{tenant.name}</h1>
        <span className="badge-active">✓ Aktiv</span>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Tenant Info
        </button>
        <button
          className={`tab-button ${activeTab === 'membership' ? 'active' : ''}`}
          onClick={() => setActiveTab('membership')}
        >
          Membership
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="detail-grid">
          <div className="detail-card">
            <h3>Tenant Info</h3>
            <div className="info-item">
              <span>Tenant ID:</span>
              <code>{tenant.tenantId}</code>
            </div>
            <div className="info-item">
              <span>Tilføjet:</span>
              <span>{new Date(tenant.addedAt).toLocaleDateString('da-DK')}</span>
            </div>
            <div className="info-item">
              <span>Status:</span>
              <span className="badge-active">Aktiv</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>User Data</h3>
            {userData ? (
              <>
                <div className="info-item">
                  <span>Display Name:</span>
                  <span>{userData.displayName}</span>
                </div>
                <div className="info-item">
                  <span>Email:</span>
                  <span>{userData.userPrincipalName}</span>
                </div>
                <div className="info-item">
                  <span>Telefon:</span>
                  <span>{userData.businessPhones?.[0] || 'N/A'}</span>
                </div>
              </>
            ) : (
              <p>Ingen data tilgængelig</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'membership' && (
        <div className="detail-grid">
          <div className="detail-card full-width">
            <h3>Brugere og Gruppetilhørighed</h3>
            {users.length === 0 ? (
              <p className="empty">Ingen brugere fundet</p>
            ) : (
              <div className="membership-table-container">
                <table className="membership-table">
                  <thead>
                    <tr>
                      <th>Navn</th>
                      <th>Email</th>
                      <th>Grupper</th>
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
                            <span className="no-groups">Ingen grupper</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}