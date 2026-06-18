import React, { useRef, useState, useEffect } from 'react';

export default function VideoItem({ 
  item, 
  index, 
  totalItems, 
  whatsappNumber, 
  whatsappTemplate, 
  isMuted, 
  onToggleMute, 
  onBack, 
  shopName,
  socialUrl,
  activeIndex,
  onActive
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const lastClickTimeRef = useRef(0);
  const hlsRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);
  const [indicatorType, setIndicatorType] = useState('play'); // 'play' or 'pause'
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [hearts, setHearts] = useState([]); // Array to store active popping hearts

  // Compute loading states based on activeIndex passed from parent
  const isCurrentlyActive = index === activeIndex;
  const isWithinPreloadRange = Math.abs(index - activeIndex) <= 1;
  const isWithinCacheRange = Math.abs(index - activeIndex) <= 2;

  // Set up Intersection Observer to handle active play state callback to parent
  useEffect(() => {
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          onActive(index);
        }
      },
      {
        threshold: 0.6
      }
    );

    if (containerRef.current) {
      playObserver.observe(containerRef.current);
    }

    return () => {
      playObserver.disconnect();
    };
  }, [index, onActive]);

  // 1. Manage HLS/Video Source Initialization & Destruction (Cache Range)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHls = item.videoUrl.endsWith('.m3u8');

    if (!isWithinCacheRange) {
      // Out of cache range: completely destroy HLS and clear source to free memory/decoder
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.src = '';
      return;
    }

    // Within cache range but HLS not initialized yet: initialize it
    if (!video.src && !hlsRef.current) {
      if (isHls) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari/iOS)
          video.src = item.videoUrl;
        } else {
          // Fallback to hls.js (Chrome/Firefox/Android)
          import('hls.js').then((HlsModule) => {
            const Hls = HlsModule.default;
            if (Hls.isSupported()) {
              const hls = new Hls({
                maxMaxBufferLength: 10, // Max buffer size in seconds
                enableWorker: true,
                lowLatencyMode: true,
              });
              hlsRef.current = hls;
              hls.loadSource(item.videoUrl);
              hls.attachMedia(video);

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isCurrentlyActive) {
                  video.play()
                    .then(() => setIsPlaying(true))
                    .catch((err) => console.log('Autoplay play error:', err));
                }
              });

              hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      console.warn('HLS Network error, trying to recover...', data);
                      hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      console.warn('HLS Media error, trying to recover...', data);
                      hls.recoverMediaError();
                      break;
                    default:
                      console.error('Fatal HLS error, destroying...', data);
                      hls.destroy();
                      hlsRef.current = null;
                      break;
                  }
                }
              });
            }
          });
        }
      } else {
        // Normal MP4 video
        video.src = item.videoUrl;
      }
    }

    return () => {
      // On unmount
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [item.videoUrl, isWithinCacheRange]);

  // 2. Control segment downloading (startLoad / stopLoad) based on Preload Range
  useEffect(() => {
    if (hlsRef.current) {
      if (isWithinPreloadRange) {
        hlsRef.current.startLoad();
      } else {
        hlsRef.current.stopLoad();
      }
    }
  }, [isWithinPreloadRange]);

  // 3. Control Video Playback (Play / Pause) based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isWithinCacheRange) return;

    if (isCurrentlyActive) {
      const isHls = item.videoUrl.endsWith('.m3u8');
      const isNativeHls = video.canPlayType('application/vnd.apple.mpegurl');
      
      // If we are using hls.js, play is triggered on MANIFEST_PARSED when it loads.
      // If it's already loaded/attached or if it's native/MP4, we can play immediately.
      if (!isHls || isNativeHls || (hlsRef.current && hlsRef.current.media)) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Autoplay was prevented:", error);
              setIsPlaying(false);
            });
        }
      }
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch (e) {
        // Suppress seeking errors before video metadata loads
      }
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isCurrentlyActive, isWithinCacheRange, item.videoUrl]);

  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Helper to spawn a floating heart
  const spawnHeart = (x, y) => {
    const newHeart = {
      id: Date.now() + Math.random(),
      x,
      y,
      rot: `${Math.random() * 40 - 20}deg`
    };
    
    setHearts((prev) => [...prev, newHeart]);

    // Clean up heart after its animation completes (800ms)
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 800);
  };

  // Handle double tap like animation
  const handleDoubleTap = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    spawnHeart(x, y);
    setLiked(true);
  };

  // Tap to play/pause toggle (single tap)
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIndicatorType('pause');
    } else {
      videoRef.current.play().catch(err => console.log(err));
      setIsPlaying(true);
      setIndicatorType('play');
    }

    // Trigger visual play/pause indicator animation
    setShowPlayIndicator(true);
    setTimeout(() => {
      setShowPlayIndicator(false);
    }, 600);
  };

  // Debounced Video Click: Differentiates single tap (play/pause) vs double tap (like)
  const handleVideoClick = (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTimeRef.current;

    if (timeDiff < 300) {
      // Double tap! Clear play/pause toggle timeout and spawn heart
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      handleDoubleTap(e);
    } else {
      // Single tap! Delay togglePlay to verify if it's a double tap
      clickTimeoutRef.current = setTimeout(() => {
        togglePlay();
      }, 250);
    }
    lastClickTimeRef.current = currentTime;
  };

  // WhatsApp link compilation
  const handleCtaClick = () => {
    if (!whatsappNumber) return;
    let text = whatsappTemplate || "¡Hola! Me interesa {itemName} por ${price}.";
    text = text.replace('{itemName}', item.name).replace('{price}', item.price);
    
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Handle Heart/Like button click
  const handleLikeClick = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    
    // Spawn a heart in the center of the video player
    if (videoRef.current) {
      const rect = videoRef.current.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      spawnHeart(x, y);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `¡Mira este producto en ${shopName}!: ${item.name} - $${item.price}`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="feed-item" ref={containerRef}>
      <div className="video-wrapper">
        {/* HTML5 Video Player */}
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="video-player"
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Floating Hearts Overlay */}
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="double-tap-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              '--rot': heart.rot
            }}
          >
            <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}

        {/* Stories-Style Progress Bar */}
        <div className="progress-bar-container">
          {Array.from({ length: totalItems }).map((_, i) => (
            <div key={i} className="progress-segment">
              <div 
                className={`progress-fill ${i < index ? 'completed' : ''}`}
                style={{ width: i === index ? `${progress}%` : undefined }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Overlay */}
        <div className="overlay-top">
          <button className="back-btn" onClick={onBack} title="Regresar al inicio">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          
          {socialUrl ? (
            <a 
              href={socialUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="shop-badge"
              style={{ cursor: 'pointer' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="logo-dot" style={{ backgroundColor: '#25d366', boxShadow: '0 0 8px #25d366' }}></span>
              <span className="shop-badge-text">{shopName}</span>
            </a>
          ) : (
            <div className="shop-badge">
              <span className="logo-dot" style={{ backgroundColor: '#25d366', boxShadow: '0 0 8px #25d366' }}></span>
              <span className="shop-badge-text">{shopName}</span>
            </div>
          )}

          <div className="top-controls">
            <button className="sound-toggle-btn" onClick={onToggleMute} title={isMuted ? "Activar sonido" : "Silenciar"}>
              {isMuted ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Temporary Play/Pause Large Screen Overlay */}
        <div className={`play-overlay ${showPlayIndicator ? 'show' : ''}`}>
          {indicatorType === 'play' ? (
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </div>

        {/* Floating Sidebar Controls (Right) */}
        <div className="sidebar-controls">
          {/* Like button */}
          <div className="control-item" onClick={handleLikeClick}>
            <div className="control-btn" style={{ color: liked ? '#ff3366' : '#fff' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="control-label">{liked ? 'Te gusta' : 'Gusto'}</span>
          </div>

          {/* Share button */}
          {/* <div className="control-item" onClick={handleShareClick}>
            <div className="control-btn" style={{ color: shared ? '#25d366' : '#fff' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 7.51l-6.82 3.98" />
              </svg>
            </div>
            <span className="control-label">{shared ? 'Copiado!' : 'Compartir'}</span>
          </div> */}
        </div>

        {/* Swipe Hint (Only show on first item to help user discover swipe action) */}
        {index === 0 && (
          <div className="swipe-hint">
            <div className="swipe-arrow"></div>
            <span className="swipe-text">Desliza</span>
          </div>
        )}

        {/* Bottom Details Overlay */}
        <div className="overlay-bottom">
          <div className="product-info">
            <div className="product-name-price">
              <h2 className="product-name">{item.name}</h2>
              <span className="product-price">${item.price}</span>
            </div>
            <p className="product-description">{item.description}</p>
          </div>

          {/* Action CTA Button */}
          {whatsappNumber && (
            <button className="cta-button" onClick={handleCtaClick}>
              <svg className="cta-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.728-1.463L0 24zm6.59-4.846c1.666.988 3.311 1.485 5.353 1.486 5.517 0 10.005-4.487 10.008-10.005.002-2.673-1.04-5.186-2.933-7.078C17.133 1.664 14.62 0.62 11.997 0.62 6.478 0.62 1.99 5.108 1.987 10.628c-.001 2.107.552 4.162 1.602 5.922l-.992 3.619 3.705-.973zm12.39-8.125c-.29-.145-1.713-.846-1.978-.942-.266-.097-.459-.145-.653.145-.193.29-.748.942-.917 1.135-.169.193-.339.218-.63.073-.29-.145-1.223-.45-2.33-1.438-.861-.768-1.443-1.717-1.612-2.008-.169-.29-.018-.447.127-.591.13-.13.29-.339.435-.508.145-.169.193-.29.29-.484.097-.193.048-.363-.024-.508-.073-.145-.653-1.573-.895-2.153-.235-.567-.474-.49-.653-.498-.168-.008-.363-.01-.557-.01-.193 0-.508.072-.773.362-.266.29-1.015.99-1.015 2.416 0 1.426 1.039 2.804 1.184 2.998.145.193 2.046 3.125 4.957 4.38.692.298 1.233.477 1.654.61.696.22 1.329.19 1.83.115.558-.085 1.713-.7 1.954-1.377.242-.678.242-1.258.17-1.377-.073-.118-.266-.19-.558-.335z" />
              </svg>
              Preguntar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
