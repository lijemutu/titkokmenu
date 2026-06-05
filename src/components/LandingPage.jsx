import React from 'react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-container">
          Ojito<span className="logo-dot"></span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tag">Piloto Local</div>
        <h1 className="hero-title">
          Dale vida a tus productos con <span>video vertical</span>
        </h1>
        <p className="hero-description">
          Una forma interactiva, rápida y móvil para que tus clientes visualicen tu calzado, comida o productos al instante con solo escanear un código QR.
        </p>
      </section>

      {/* Demo Stores Section */}
      <section className="demo-section">
        <h2 className="section-title">Elige un catálogo demo</h2>
        <div className="demo-cards-container">
          {/* Card 1: Shoes */}
          <div 
            className="demo-card shoes" 
            onClick={() => onNavigate('calzadosluna')}
          >
            <div className="card-icon">👟</div>
            <h3 className="card-title">Calzados Luna</h3>
            <p className="card-desc">
              Zapatería local de San Mateo Atenco. Explora botas Chelsea, zapatillas de tacón y tenis de piel en video.
            </p>
            <button className="card-btn">Ver Catálogo</button>
          </div>

          {/* Card 2: Cafe */}
          <div 
            className="demo-card cafe" 
            onClick={() => onNavigate('cafeluna')}
          >
            <div className="card-icon">☕</div>
            <h3 className="card-title">Café Luna</h3>
            <p className="card-desc">
              Cafetería local. Antójate con videos cortos de latte art, croissants recién horneados y postres premium.
            </p>
            <button className="card-btn">Ver Catálogo</button>
          </div>

          {/* Card 3: Underprice */}
          <div 
            className="demo-card underprice" 
            onClick={() => onNavigate('underprice')}
          >
            <div className="card-icon">🛍️</div>
            <h3 className="card-title">Underprice</h3>
            <p className="card-desc">
              Tu nueva colección. Explora los 10 videos verticales reales de productos que acabas de subir al catálogo.
            </p>
            <button className="card-btn">Ver Catálogo</button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <h2 className="section-title" style={{ fontSize: '1.75rem' }}>¿Cómo funciona Ojito?</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-num">1</div>
            <h3 className="step-title">Graba tus productos</h3>
            <p className="step-desc">Graba videos cortos (5-10 seg) en formato vertical directo con tu celular.</p>
          </div>
          <div className="step-item">
            <div className="step-num">2</div>
            <h3 className="step-title">Vincula y Publica</h3>
            <p className="step-desc">Sube tus videos a un CDN optimizado y agrégalos a tu archivo de catálogo JSON.</p>
          </div>
          <div className="step-item">
            <div className="step-num">3</div>
            <h3 className="step-title">Genera el QR</h3>
            <p className="step-desc">Imprime tu código QR y colócalo en el mostrador, mesa o empaque del producto.</p>
          </div>
          <div className="step-item">
            <div className="step-num">4</div>
            <h3 className="step-title">Contacto Directo</h3>
            <p className="step-desc">El cliente escanea, ve los videos en pantalla completa y te contacta directo por WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Ojito - Diseñado para fortalecer el comercio local en San Mateo Atenco. ¡Échale un ojito!</p>
      </footer>
    </div>
  );
}
