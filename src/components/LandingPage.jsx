import React from 'react';
import logoTransparent from '../assets/logo_transparent.png';

// Custom SVG Logo implementing the brand's unique anatomy (kept as a reusable asset)
export const OjitoLogo = ({ className = "" }) => (
  <svg 
    viewBox="0 0 170 65" 
    className={`ojito-logo-svg ${className}`} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Underline base line - broken into two segments around the 'j' at x=58 */}
    <path d="M 8,48 L 50,48" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M 66,48 L 162,48" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
    
    {/* O1: Vertical capsule with pupil */}
    <rect x="16" y="14" width="24" height="34" rx="12" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
    <circle cx="28" cy="31" r="3.5" fill="currentColor" />
    
    {/* j: Breaks the underline, curving down and to the left */}
    <path d="M 58,14 L 58,48 A 10,10 0 0,1 48,58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="58" cy="6" r="3.5" fill="currentColor" />
    
    {/* i: Friendly dot */}
    <path d="M 78,20 L 78,48" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
    <circle cx="78" cy="11" r="3.5" fill="currentColor" />
    
    {/* t: Rounded crossbar */}
    <path d="M 98,12 L 98,48 M 90,23 L 106,23" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* O2: Second vertical capsule with pupil */}
    <rect x="118" y="14" width="24" height="34" rx="12" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
    <circle cx="130" cy="31" r="3.5" fill="currentColor" />
  </svg>
);

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-wrapper-header">
          <img src={logoTransparent} className="brand-logo-img" alt="Ojito Logo" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated local validation badge */}
        <div className="badge-approved" title="¡Ojito Local Aprobado!">
          <svg viewBox="0 0 100 100" className="badge-svg">
            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
            <text fill="#000">
              <textPath href="#circlePath" className="badge-text-path">
                • ojito local • producto real • antojo 100%
              </textPath>
            </text>
          </svg>
          <div className="badge-eyes">
            <div className="badge-eye">
              <div className="badge-pupil"></div>
            </div>
            <div className="badge-eye">
              <div className="badge-pupil"></div>
            </div>
          </div>
        </div>

        <div className="hero-tag">🌟 Piloto Local</div>
        <h1 className="hero-title">
          Dale vida a tus productos con <span>video vertical</span>
        </h1>
        <p className="hero-description">
          Simplifica la compra de tus clientes. Sin catálogos aburridos: ven el producto real en video, escanean un código QR y te piden directo por WhatsApp.
        </p>
      </section>

      {/* Demo Stores Section */}
      <section className="demo-section">
        <h2 className="section-title">Échale un ojito a las demos</h2>
        <p className="section-subtitle">Elige un comercio local y vive la experiencia móvil real</p>
        
        <div className="demo-cards-container">
        
          {/* Card 1: Nectar & Embers */}
          <div 
            className="demo-card nectar-embers" 
            onClick={() => onNavigate('nectar-embers')}
          >
            <div className="card-icon">🍹</div>
            <h3 className="card-title">Nectar & Embers</h3>
            <p className="card-desc">
              Bar y restaurante rústico-moderno. Cortes al fuego de leña y coctelería de autor premium en video vertical.
            </p>
            <button className="card-btn">Ver Catálogo</button>
          </div>
        
          {/* Card 2: Underprice */}
          <div 
            className="demo-card underprice" 
            onClick={() => onNavigate('underprice')}
          >
            <div className="card-icon">🛍️</div>
            <h3 className="card-title">Underprice</h3>
            <p className="card-desc">
              Ropa y accesorios de moda. Videos verticales reales con el tallaje y movimiento real de las prendas.
            </p>
            <button className="card-btn">Ver Catálogo</button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <h2 className="section-title" style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>¿Cómo funciona Ojito?</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-num">1</div>
            <h3 className="step-title">Graba tus productos</h3>
            <p className="step-desc">Toma tu celular y graba videos cortos (5-10 segundos) mostrando el producto real y sus detalles.</p>
          </div>
          <div className="step-item">
            <div className="step-num">2</div>
            <h3 className="step-title">Sube y Vincula</h3>
            <p className="step-desc">Tus videos se optimizan para reproducirse al instante sin consumir los datos de tus clientes.</p>
          </div>
          <div className="step-item">
            <div className="step-num">3</div>
            <h3 className="step-title">Pega tu Código QR</h3>
            <p className="step-desc">Coloca el código QR en mesas, mostradores o empaques. Escanear abre el catálogo de inmediato.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Ojito — Diseñado con ❤️ para fortalecer el comercio local y el trato humano. ¡Échale un ojito!</p>
      </footer>
    </div>
  );
}
