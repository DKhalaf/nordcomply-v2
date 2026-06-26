import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const API_BASE = 'https://nordcomply-api.dshvan5.workers.dev';

export default function AdminPanel() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    friendlyName: '',
    tenantId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants();
    
    // Check for success query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('tenant_added') === 'true') {
      setSuccess('Tenant tilføjet! Genindlæser...');
      setTimeout(() => fetchTenants(), 2000);
    }
  }, []);

  async function fetchTenants() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/tenants`);
      if (!response.ok) throw new Error('Failed to fetch tenants');
      const data = await response.json();
      setTenants(data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const { friendlyName, tenantId } = formData;

    if (!friendlyName.trim() || !tenantId.trim()) {
      setError('Udfyld alle felter');
      setIsSubmitting(false);
      return;
    }

    // Validate GUID format
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(tenantId)) {
      setError('Tenant ID er ikke et gyldigt GUID');
      setIsSubmitting(false);
      return;
    }

    try {
      // Start OAuth flow
      const response = await fetch(`${API_BASE}/auth/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenantId.trim(),
          friendlyName: friendlyName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start auth flow');
      }

      const { authUrl } = await response.json();

      // Redirect to Microsoft login
      setSuccess('Omdirigerer til Microsoft 365...');
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <p>Importer dine M365 tenants for at få adgang til sikkerhedsdata</p>

      <div className="admin-grid">
        {/* Form Section */}
        <div className="admin-card form-section">
          <h2>Tilføj Tenant</h2>

          {error && <div className="error-box">{error}</div>}
          {success && <div className="success-box">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="friendlyName">Tenant navn</label>
              <input
                id="friendlyName"
                name="friendlyName"
                type="text"
                placeholder="f.eks. 'Guard365 Main'"
                value={formData.friendlyName}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tenantId">Tenant ID (Azure GUID)</label>
              <input
                id="tenantId"
                name="tenantId"
                type="text"
                placeholder="f.eks. b7714735-4214-4780-aa87-8b73422f7c96"
                value={formData.tenantId}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? 'Godkender...' : 'Godkend & Tilføj Tenant'}
            </button>
          </form>

          <div className="form-help">
            <h4>Hvordan finder jeg Tenant ID?</h4>
            <ol>
              <li>Gå til Azure Portal → Entra ID</li>
              <li>Klik "Properties"</li>
              <li>Kopier "Tenant ID"</li>
            </ol>
          </div>
        </div>

        {/* Tenants List Section */}
        <div className="admin-card tenants-section">
          <h2>Tilsluttede Tenants</h2>

          {loading ? (
            <p className="loading">Indlæser...</p>
          ) : tenants.length === 0 ? (
            <p className="empty">Ingen tenants tilføjet endnu</p>
          ) : (
            <div className="tenants-list">
              {tenants.map((tenant, idx) => (
                <div key={idx} className="tenant-item">
                  <div className="tenant-header">
                    <h3>{tenant.name}</h3>
                    <span className="tenant-status">✓ Aktiv</span>
                  </div>
                  <div className="tenant-info">
                    <p><strong>Tenant ID:</strong> {tenant.tenantId}</p>
                    <p><strong>Oprettet:</strong> {new Date(tenant.addedAt).toLocaleDateString('da-DK')}</p>
                    {tenant.id && <p><strong>Local ID:</strong> {tenant.id}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}