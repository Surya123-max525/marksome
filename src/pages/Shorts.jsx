import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { fetchShorts } from '../utils/api';
import ChannelAvatar from '../components/ChannelAvatar';
import './Shorts.css';

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShorts = async () => {
      setLoading(true);
      const data = await fetchShorts();
      if (data?.items) {
        setShorts(data.items);
      }
      setLoading(false);
    };
    loadShorts();
  }, []);

  if (loading) {
    return <div className="shorts-page flex justify-center items-center"><div className="skeleton shorts-container"></div></div>;
  }

  return (
    <div className="shorts-page flex-col items-center">
      {shorts.map((short, idx) => {
        const videoId = short.id.videoId;
        if (!videoId) return null;
        return (
          <div key={idx} className="shorts-container flex">
            <div className="shorts-player">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
                className="react-player-shorts"
                width="100%"
                height="100%"
                title="YouTube Shorts player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <div className="shorts-info">
                <h3 className="line-clamp-2">{short.snippet.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <ChannelAvatar channelId={short.snippet.channelId} channelTitle={short.snippet.channelTitle} size="md" />
                  <span className="text-sm font-bold">{short.snippet.channelTitle}</span>
                  <button className="btn btn-primary" style={{padding: '4px 12px', fontSize: 12}}>Subscribe</button>
                </div>
              </div>
            </div>
            
            <div className="shorts-actions flex flex-col items-center gap-4">
              <button className="action-btn-shorts flex flex-col items-center gap-1">
                <div className="circle-bg"><ThumbsUp size={24} fill="var(--bg-secondary)" /></div>
                <span className="text-xs">Like</span>
              </button>
              <button className="action-btn-shorts flex flex-col items-center gap-1">
                <div className="circle-bg"><ThumbsDown size={24} /></div>
                <span className="text-xs">Dislike</span>
              </button>
              <button className="action-btn-shorts flex flex-col items-center gap-1">
                <div className="circle-bg"><MessageSquare size={24} /></div>
                <span className="text-xs">Comment</span>
              </button>
              <button className="action-btn-shorts flex flex-col items-center gap-1">
                <div className="circle-bg"><Share2 size={24} /></div>
                <span className="text-xs">Share</span>
              </button>
              <button className="action-btn-shorts flex flex-col items-center gap-1">
                <div className="circle-bg"><MoreHorizontal size={24} /></div>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Shorts;
