import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantId: '',
    gaEmail: '',
    gaPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/import-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `✓ ${data.message}` });
        setFormData({ tenantName: '', tenantId: '', gaEmail: '', gaPassword: '' });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setMessage({ type: 'error', text: `✗ ${data.error || 'Noget gik galt'}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `✗ Fejl: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin">
      {/* Navigation */}
      <nav className="admin-nav">
        <div className="admin-nav__inner">
          <div className="admin-nav__brand">
            <span>NordComply Portal</span>
          </div>
          <ul className="admin-nav__menu">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/admin" className="active">Admin</a></li>
          </ul>
          <div className="admin-nav__user">
            <img src={user?.picture} alt={user?.name} className="admin-nav__avatar" />
            <span>{user?.name}</span>
            <button onClick={handleLogout} className="admin-nav__logout">
              Log ud
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="admin-content">
        <div className="wrap">
          <div className="admin-header">
            <h1>Admin Panel</h1>
            <p>Importer dine M365 tenants for at få adgang til sikkerhedsdata</p>
          </div>

          <div className="admin-form-container">
            <form onSubmit={handleSubmit} className="admin-form">
              <h2>Importer Tenant</h2>

              <div className="form-group">
                <label htmlFor="tenantName">Tenant Navn</label>
                <input
                  id="tenantName"
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  placeholder="f.eks. Min Virksomhed"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tenantId">Tenant ID (GUID)</label>
                <input
                  id="tenantId"
                  type="text"
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleChange}
                  placeholder="b7714735-4214-4780-aa87-8b73422f7c96"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gaEmail">Global Admin Email</label>
                <input
                  id="gaEmail"
                  type="email"
                  name="gaEmail"
                  value={formData.gaEmail}
                  onChange={handleChange}
                  placeholder="admin@virksomhed.onmicrosoft.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gaPassword">Global Admin Adgangskode</label>
                <input
                  id="gaPassword"
                  type="password"
                  name="gaPassword"
                  value={formData.gaPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {message.text && (
                <div className={`message message--${message.type}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? 'Importerer...' : 'Importer Tenant'}
              </button>
            </form>

            <div className="admin-info">
              <h3>Hjælp</h3>
              <ul>
                <li>
                  <strong>Tenant ID:</strong> Find det i Azure Portal → Entra ID → Egenskaber
                </li>
                <li>
                  <strong>Global Admin:</strong> Bruge en konto med Global Administrator rolle
                </li>
                <li>
                  <strong>MFA:</strong> Hvis Global Admin har MFA enabled, brug en app-adgangskode i stedet
                </li>
                <li>
                  <strong>Sikkerhed:</strong> Vi gemmer kun refresh token, ikke dine legitimationer
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
