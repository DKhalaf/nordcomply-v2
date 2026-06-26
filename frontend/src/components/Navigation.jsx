import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navigation.css';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => navigate('/')}>
        NordComply
      </div>
      
      <div className="nav-menu">
        <a href="#" onClick={() => navigate('/dashboard')} className="nav-link active">
          Dashboard
        </a>
        <a href="#" onClick={() => navigate('/tenants')} className="nav-link">
          Tenants
        </a>
        <a href="#" onClick={() => navigate('/admin')} className="nav-link">
          Admin
        </a>
      </div>

      <div className="nav-right">
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <span className="nav-email">{user?.email}</span>
        <button onClick={logout} className="btn-logout">
          Log ud
        </button>
      </div>
    </nav>
  );
}