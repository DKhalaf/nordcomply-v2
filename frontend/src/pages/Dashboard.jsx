import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tenants from API
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants');
      if (response.ok) {
        const data = await response.json();
        setTenants(data);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav__inner">
          <div className="dashboard-nav__brand">
            <span>NordComply Portal</span>
          </div>
          <ul className="dashboard-nav__menu">
            <li><a href="/dashboard" className="active">Dashboard</a></li>
            <li><a href="/admin">Admin</a></li>
          </ul>
          <div className="dashboard-nav__user">
            <img src={user?.picture} alt={user?.name} className="dashboard-nav__avatar" />
            <span>{user?.name}</span>
            <button onClick={handleLogout} className="dashboard-nav__logout">
              Log ud
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="wrap">
          <div className="dashboard-header">
            <h1>Velkommen, {user?.name}!</h1>
            <p>Få overblik over dine M365 tenants og sikkerhedsstatus</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Antal tenants</h3>
              <div className="stat-value">{tenants.length}</div>
              <p className="stat-label">Importerede tenants</p>
            </div>
            <div className="stat-card">
              <h3>Gennemsnitlig Secure Score</h3>
              <div className="stat-value">
                {tenants.length > 0
                  ? Math.round(
                      tenants.reduce((sum, t) => sum + (t.secureScore || 0), 0) / tenants.length
                    )
                  : '--'}
              </div>
              <p className="stat-label">Score point</p>
            </div>
            <div className="stat-card">
              <h3>Status</h3>
              <div className="stat-value" style={{ color: tenants.length > 0 ? '#10b981' : '#6b7280' }}>
                {tenants.length > 0 ? '✓ Aktiv' : 'Ingen data'}
              </div>
              <p className="stat-label">System status</p>
            </div>
          </div>

          {/* Tenants List */}
          <div className="tenants-section">
            <h2>Dine Tenants</h2>
            {loading ? (
              <div className="loading">Indlæser...</div>
            ) : tenants.length === 0 ? (
              <div className="empty-state">
                <p>Du har ikke importeret nogen tenants endnu.</p>
                <button onClick={() => navigate('/admin')} className="empty-state__btn">
                  Importer din første tenant
                </button>
              </div>
            ) : (
              <div className="tenants-grid">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="tenant-card">
                    <div className="tenant-card__header">
                      <h3>{tenant.name}</h3>
                      <span className="tenant-card__id">{tenant.tenantId?.substring(0, 8)}...</span>
                    </div>
                    <div className="tenant-card__content">
                      <div className="tenant-card__item">
                        <span className="label">Status</span>
                        <span className="value">Aktiv</span>
                      </div>
                      <div className="tenant-card__item">
                        <span className="label">Importeret</span>
                        <span className="value">{new Date(tenant.addedAt).toLocaleDateString('da-DK')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          {tenants.length > 0 && (
            <div className="dashboard-actions">
              <button onClick={() => navigate('/admin')} className="btn btn--primary">
                Tilføj tenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
