import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';  // i stedet for './Dashboard.css'

const API_BASE = 'https://nordcomply-api.dshvan5.workers.dev';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      const res = await fetch(`${API_BASE}/api/tenants`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setTenants(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Dashboard</h1>
        <p>Oversigt over dine Microsoft 365 tenants</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Total Tenants</div>
          <div className="stat-value">{tenants.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-label">Aktive</div>
          <div className="stat-value">{tenants.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-label">Status</div>
          <div className="stat-value">{tenants.length > 0 ? 'Healthy' : 'No data'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-label">Sync Status</div>
          <div className="stat-value">Live</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <button onClick={() => navigate('/admin')} className="btn-primary">
            + Add Tenant
          </button>
        </div>

        {loading ? (
          <p className="loading">Indlæser...</p>
        ) : tenants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">Du har ingen tenants endnu</div>
            <button onClick={() => navigate('/admin')} className="btn-primary">
              Tilføj din første tenant
            </button>
          </div>
        ) : (
          <div className="table">
            <div className="table-header">
              <div>Tenant</div>
              <div>ID</div>
              <div>Added</div>
              <div>Status</div>
              <div></div>
            </div>
            {tenants.map((tenant) => (
              <div key={tenant.id} className="table-row">
                <div
                  className="tenant-name"
                  onClick={() => navigate(`/tenant/${tenant.id}`)}
                >
                  {tenant.name}
                </div>
                <div className="badge-id">{tenant.tenantId.substring(0, 8)}...</div>
                <div className="table-date">
                  {new Date(tenant.addedAt).toLocaleDateString('da-DK')}
                </div>
                <div>
                  <span className="badge badge-active">✓ Aktiv</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button className="action-btn">⋮</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}