import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SecureScore from './SecureScore';
import Membership from './Membership';
import MfaStatus from './MfaStatus';
import ConditionalAccess from './ConditionalAccess';
import './styles.css';

const API_BASE = 'https://nordcomply-api.dshvan5.workers.dev';

const tabStyles = `
  .tenant-detail-tabs {
    display: flex;
    gap: 12px;
    margin: 24px 0;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    padding-bottom: 12px;
    overflow-x: auto;
  }

  .tab-button {
    padding: 10px 16px;
    border: none;
    background: transparent;
    color: var(--text-secondary, #6b7280);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    position: relative;
    white-space: nowrap;
  }

  .tab-button:hover {
    color: var(--text-primary, #1f2937);
  }

  .tab-button.active {
    color: var(--primary-color, #2563eb);
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-color, #2563eb);
  }
`;

export default function TenantDetail() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('secure-score');

  useEffect(() => {
    fetchTenantData();
  }, [tenantId]);

  async function fetchTenantData() {
    try {
      setLoading(true);
      
      const tenantsRes = await fetch(`${API_BASE}/api/tenants`);
      if (!tenantsRes.ok) throw new Error('Failed to fetch tenants');
      const tenants = await tenantsRes.json();
      const foundTenant = tenants.find(t => t.id === tenantId);
      
      if (!foundTenant) throw new Error('Tenant not found');
      setTenant(foundTenant);
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
      <style>{tabStyles}</style>
      <button onClick={() => navigate('/tenants')} className="btn-back">
        ← Tilbage til tenants
      </button>

      <div className="detail-header">
        <h1>{tenant.name}</h1>
        <span className="badge-active">✓ Aktiv</span>
      </div>

      <div className="tenant-detail-tabs">
        <button
          className={`tab-button ${activeTab === 'secure-score' ? 'active' : ''}`}
          onClick={() => setActiveTab('secure-score')}
        >
          Secure Score
        </button>
        <button
          className={`tab-button ${activeTab === 'membership' ? 'active' : ''}`}
          onClick={() => setActiveTab('membership')}
        >
          Membership
        </button>
        <button
          className={`tab-button ${activeTab === 'mfa' ? 'active' : ''}`}
          onClick={() => setActiveTab('mfa')}
        >
          MFA Status
        </button>
        <button
          className={`tab-button ${activeTab === 'conditional-access' ? 'active' : ''}`}
          onClick={() => setActiveTab('conditional-access')}
        >
          Conditional Access
        </button>
      </div>

      {activeTab === 'secure-score' && (
        <SecureScore tenantId={tenant.tenantId} tenantName={tenant.name} />
      )}

      {activeTab === 'membership' && (
        <Membership tenantId={tenant.tenantId} tenantName={tenant.name} />
      )}

      {activeTab === 'mfa' && (
        <MfaStatus tenantId={tenant.tenantId} tenantName={tenant.name} />
      )}

      {activeTab === 'conditional-access' && (
        <ConditionalAccess tenantId={tenant.tenantId} tenantName={tenant.name} />
      )}
    </div>
  );
}