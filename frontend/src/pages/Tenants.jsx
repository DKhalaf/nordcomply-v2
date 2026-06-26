import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';  // i stedet for './Dashboard.css'

const API_BASE = 'https://nordcomply-api.dshvan5.workers.dev';

export default function Tenants() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/tenants`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTenants(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTenant(tenantId) {
    try {
      const res = await fetch(`${API_BASE}/api/tenant?tenantId=${tenantId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteConfirm(null);
      await fetchTenants();
    } catch (err) {
      alert(`Fejl: ${err.message}`);
    }
  }

  return (
    <div className="tenants">
      <div className="tenants__header">
        <div>
          <h1>Tenants</h1>
          <p>Administrer dine Microsoft 365 tenants</p>
        </div>
        <button onClick={() => navigate('/admin')} className="btn-primary">
          + Tilføj Tenant
        </button>
      </div>

      {loading ? (
        <p className="loading">Indlæser...</p>
      ) : tenants.length === 0 ? (
        <div className="empty-state">
          <p>Du har ingen tenants endnu</p>
          <button onClick={() => navigate('/admin')} className="btn-primary">
            Tilføj din første tenant
          </button>
        </div>
      ) : (
        <div className="tenants-table">
          <div className="table-header">
            <div className="col-name">Navn</div>
            <div className="col-id">Tenant ID</div>
            <div className="col-date">Tilføjet</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Handlinger</div>
          </div>

          {tenants.map((tenant) => (
            <div key={tenant.id} className="table-row">
              <div className="col-name">
                <button
                  onClick={() => navigate(`/tenant/${tenant.id}`)}
                  className="tenant-link"
                >
                  {tenant.name}
                </button>
              </div>
              <div className="col-id">
                <code>{tenant.tenantId.substring(0, 8)}...</code>
              </div>
              <div className="col-date">
                {new Date(tenant.addedAt).toLocaleDateString('da-DK')}
              </div>
              <div className="col-status">
                <span className="badge-active">✓ Aktiv</span>
              </div>
              <div className="col-actions">
                {deleteConfirm === tenant.id ? (
                  <div className="delete-confirm">
                    <button
                      onClick={() => handleDeleteTenant(tenant.tenantId)}
                      className="btn-delete-small"
                    >
                      Ja
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="btn-cancel-small"
                    >
                      Nej
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(tenant.id)}
                    className="btn-delete-icon"
                    title="Slet tenant"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}