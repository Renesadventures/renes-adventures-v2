import React from 'react';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

interface VideoFrameProps {
  videoUrl?: string;
  posterUrl?: string;
}

const VideoFrame: React.FC<VideoFrameProps> = ({ 
  videoUrl = `${base}/videos/hero/renes-custom-adventures.mp4`,
  posterUrl 
}) => {
  return (
    <div 
      className="video-frame-container" 
      style={{ 
        width: '100%', 
        maxWidth: '800px', 
        height: '400px', 
        backgroundColor: '#000',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          display: 'block'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoFrame;
