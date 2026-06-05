import React, { useState } from 'react';
import VideoItem from './VideoItem';

export default function VideoFeed({ catalog, onBack }) {
  const [isMuted, setIsMuted] = useState(true);

  const handleToggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  return (
    <div className="feed-container">
      {catalog.items.map((item, index) => (
        <VideoItem
          key={item.id}
          item={item}
          index={index}
          totalItems={catalog.items.length}
          whatsappNumber={catalog.whatsappNumber}
          whatsappTemplate={catalog.whatsappTemplate}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onBack={onBack}
          shopName={catalog.shopName}
        />
      ))}
    </div>
  );
}
