import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Stick nav on scroll
    const nav = document.querySelector('.landing-nav');
    function onScroll() {
      if (window.scrollY > 10) {
        nav?.classList.add('stuck');
      } else {
        nav?.classList.remove('stuck');
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing">
      {/* Atmospheric background */}
      <div className="atmosphere">
        <div className="atmosphere__grid"></div>
        <div className="atmosphere__orb atmosphere__orb--1"></div>
        <div className="atmosphere__orb atmosphere__orb--2"></div>
        <div className="atmosphere__orb atmosphere__orb--3"></div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <div className="landing-nav__brand">
            <svg className="landing-nav__logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#0a1128" stroke="url(#logo-gradient)" strokeWidth="1" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <path d="M10 22V10l8 12V10M24 11h2" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            NordComply Portal
          </div>
          <button className="landing-nav__login-btn" onClick={() => navigate('/login')}>
            Log ind
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero sec">
        <div className="wrap">
          <h1 className="hero__h1">
            Microsoft 365<br />
            <span className="hero__highlight">Security Portal</span>
          </h1>
          <p className="hero__sub">
            Importer dine tenants, få indsigt i Secure Score, MFA status og sikkerhedspolitikker på et blik.
          </p>
          <button className="hero__cta" onClick={() => navigate('/login')}>
            Kom i gang nu
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features sec" id="features">
        <div className="wrap">
          <h2 className="sec__h2">Hvad kan du gøre?</h2>
          <div className="features__grid">
            <div className="features__card">
              <div className="features__icon">📊</div>
              <h3>Secure Score</h3>
              <p>Se din Secure Score for hver tenant og få anbefalinger til forbedringer</p>
            </div>
            <div className="features__card">
              <div className="features__icon">🔐</div>
              <h3>MFA Status</h3>
              <p>Tjek MFA-adoption blandt dine brugere og identificer risici</p>
            </div>
            <div className="features__card">
              <div className="features__icon">📋</div>
              <h3>Conditional Access</h3>
              <p>Få overblik over aktive sikkerhedspolitikker og deres impact</p>
            </div>
            <div className="features__card">
              <div className="features__icon">⚡</div>
              <h3>Hurtig Setup</h3>
              <p>Importer dine tenants med Global Admin credentials på få sekunder</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="sec how-it-works" id="how">
        <div className="wrap">
          <h2 className="sec__h2">Sådan fungerer det</h2>
          <div className="steps">
            <div className="step">
              <div className="step__number">1</div>
              <h3>Log ind</h3>
              <p>Brug din Google-konto til at få adgang til portalen</p>
            </div>
            <div className="step">
              <div className="step__number">2</div>
              <h3>Importer tenant</h3>
              <p>Tilføj dine M365 tenants med Global Admin-legitimation</p>
            </div>
            <div className="step">
              <div className="step__number">3</div>
              <h3>Få indsigt</h3>
              <p>Se Secure Score, MFA status og sikkerhedsstatus øjeblikkeligt</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section sec">
        <div className="wrap">
          <h2 className="cta-section__h2">Klar til at tage kontrol over din sikkerhed?</h2>
          <button className="cta-section__btn" onClick={() => navigate('/login')}>
            Start gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="wrap">
          <p>&copy; 2026 NordComply. Alle rettigheder forbeholdt.</p>
        </div>
      </footer>
    </div>
  );
}
