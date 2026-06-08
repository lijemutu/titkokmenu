import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import VideoFeed from './components/VideoFeed';

function App() {
  const [shopSlug, setShopSlug] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('s') || params.get('shop') || null;
  });
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Monitor browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('s') || params.get('shop') || null;
      setShopSlug(slug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch catalog JSON configuration when slug changes
  useEffect(() => {
    if (!shopSlug) {
      setCatalog(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/catalogs/${shopSlug}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('No pudimos encontrar el catálogo solicitado. Verifica la dirección o el código QR.');
        }
        return res.json();
      })
      .then((data) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Hubo un problema al cargar el catálogo.');
        setLoading(false);
      });
  }, [shopSlug]);

  // Apply branding colors dynamically based on catalog config
  useEffect(() => {
    if (catalog && catalog.theme) {
      const primary = catalog.theme.primaryColor || '#ff3366';
      const accent = catalog.theme.accentColor || '#ff6633';
      
      // Update variables in root
      document.documentElement.style.setProperty('--primary-glow', `linear-gradient(135deg, ${primary}, ${accent})`);
      document.documentElement.style.setProperty('#ff3366', primary);
    } else {
      // Restore default gradient
      document.documentElement.style.removeProperty('--primary-glow');
    }
  }, [catalog]);

  const handleNavigate = (slug) => {
    if (slug) {
      window.history.pushState({}, '', `?s=${slug}`);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
    setShopSlug(slug);
  };

  // Render Loading Screen
  if (loading) {
    return (
      <div className="ojitos-loading-screen">
        <div className="ojitos-loader">
          <div className="ojito-capsule">
            <div className="ojito-pupil"></div>
          </div>
          <div className="ojito-capsule">
            <div className="ojito-pupil"></div>
          </div>
        </div>
        <h2 className="loading-title">Cargando catálogo...</h2>
        <p className="loading-desc">Échale un ojito a lo que viene.</p>
      </div>
    );
  }

  // Render Error Screen
  if (error) {
    return (
      <div className="ojitos-error-screen">
        <div className="ojitos-error-icon">⚠️</div>
        <h2 className="error-title">Catálogo No Encontrado</h2>
        <p className="error-desc">{error}</p>
        <button className="error-btn" onClick={() => handleNavigate(null)}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Render Video Feed
  if (catalog) {
    return (
      <VideoFeed 
        catalog={catalog} 
        onBack={() => handleNavigate(null)} 
      />
    );
  }

  // Render default Landing Page
  return (
    <LandingPage onNavigate={handleNavigate} />
  );
}

export default App;
