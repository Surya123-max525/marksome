import React, { useEffect, useState } from 'react';
import { fetchChannelIcon } from '../utils/api';
import './ChannelAvatar.css';

const ChannelAvatar = ({ channelId, channelTitle, size = 'md' }) => {
  const [iconUrl, setIconUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (channelId) {
      fetchChannelIcon(channelId).then(url => {
        if (mounted && url) setIconUrl(url);
      });
    }
    return () => { mounted = false; };
  }, [channelId]);

  if (iconUrl) {
    return (
      <img 
        src={iconUrl} 
        alt={channelTitle} 
        className={`channel-avatar-img size-${size}`} 
      />
    );
  }

  return (
    <div className={`channel-avatar-fallback size-${size}`}>
      {channelTitle ? channelTitle.charAt(0).toUpperCase() : '?'}
    </div>
  );
};

export default ChannelAvatar;
