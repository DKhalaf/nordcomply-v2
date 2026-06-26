import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';  // i stedet for './Dashboard.css'

const API_BASE = 'https://nordcomply-api.dshvan5.workers.dev';

export default function TenantDetail() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    </div>
  );
}