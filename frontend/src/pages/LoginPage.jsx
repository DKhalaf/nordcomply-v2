import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  useEffect(() => {
    // Initialize Google Sign-In button
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '742410486050-your-client-id.apps.googleusercontent.com',
        callback: (response) => {
          handleLogin(response);
          navigate('/dashboard');
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          logo_alignment: 'left',
        }
      );
    }
  }, [handleLogin, navigate]);

  return (
    <div className="login-container">
      {/* Atmospheric background */}
      <div className="atmosphere">
        <div className="atmosphere__grid"></div>
        <div className="atmosphere__orb atmosphere__orb--1"></div>
        <div className="atmosphere__orb atmosphere__orb--2"></div>
      </div>

      <div className="login-box">
        <div className="login-header">
          <svg className="login-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#0a1128" stroke="url(#logo-gradient)" strokeWidth="1" />
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <path d="M10 22V10l8 12V10M24 11h2" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1>NordComply Portal</h1>
          <p>Microsoft 365 Security Management</p>
        </div>

        <div className="login-content">
          <h2>Log ind</h2>
          <p>Brug din Google-konto for at få adgang</p>

          <div id="google-signin-button" className="google-signin-wrapper"></div>

          <div className="login-divider">
            <span>eller</span>
          </div>

          <div className="login-info">
            <p>
              📧 <strong>Kun Google-login understøttet i øjeblikket</strong>
            </p>
            <p className="small">
              Din e-mail bruges kun til autentificering. Vi gemmer ikke dine oplysninger uden dit samtykke.
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p>
            Første gang her? <a href="/">Gå tilbage til start</a>
          </p>
        </div>
      </div>
    </div>
  );
}