import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from 'lucide-react';
import { fetchVideoDetails, fetchRelatedVideos } from '../utils/api';
import { supabase } from '../utils/supabaseClient';
import VideoCard from '../components/VideoCard';
import ChannelAvatar from '../components/ChannelAvatar';
import './VideoDetails.css';

const VideoDetails = () => {
  const { id } = useParams();
  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const loadVideo = async () => {
      const details = await fetchVideoDetails(id);
      if (details?.items?.length > 0) {
        const video = details.items[0];
        setVideoDetail(video);
        
        // Save to watch history if logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('watch_history').insert([
            { 
              user_id: session.user.id, 
              video_id: id, 
              title: video.snippet.title,
              thumbnail_url: video.snippet.thumbnails?.medium?.url,
              channel_title: video.snippet.channelTitle
            }
          ]);
        }
      }
      
      const related = await fetchRelatedVideos(id);
      if (related?.items) {
        setRelatedVideos(related.items);
      }
    };
    loadVideo();
  }, [id]);

  if (!videoDetail) return <div className="skeleton" style={{ height: '60vh', width: '100%' }}></div>;

  const { snippet, statistics } = videoDetail;

  return (
    <div className="video-details-page flex gap-4">
      <div className="player-section flex-col">
        <div className="player-wrapper">
          <iframe 
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            className="react-player"
            width="100%"
            height="100%"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <h1 className="video-title-main">{snippet.title}</h1>
        
        <div className="video-stats-actions flex justify-between items-center">
          <div className="channel-info flex items-center gap-4">
            <ChannelAvatar channelId={snippet.channelId} channelTitle={snippet.channelTitle} size="lg" />
            <div>
              <h3 className="channel-name-lg">{snippet.channelTitle}</h3>
              <p className="text-sm text-gray">Subscriber count hidden</p>
            </div>
            <button className="btn btn-primary subscribe-btn">Subscribe</button>
          </div>
          
          <div className="actions flex gap-2">
            <div className="action-group flex">
              <button className="action-btn flex items-center gap-2">
                <ThumbsUp size={20} /> {parseInt(statistics.likeCount).toLocaleString()}
              </button>
              <div className="divider"></div>
              <button className="action-btn flex items-center"><ThumbsDown size={20} /></button>
            </div>
            <button className="action-btn flex items-center gap-2"><Share2 size={20} /> Share</button>
            <button className="action-btn flex items-center gap-2"><Download size={20} /> Download</button>
            <button className="action-btn circle"><MoreHorizontal size={20} /></button>
          </div>
        </div>

        <div className="video-description">
          <p className="views-date font-bold mb-2">
            {parseInt(statistics.viewCount).toLocaleString()} views • {new Date(snippet.publishedAt).toLocaleDateString()}
          </p>
          <p className="desc-text">{snippet.description}</p>
        </div>
      </div>

      <div className="related-section flex-col gap-4">
        {relatedVideos.map((video, idx) => (
          <VideoCard key={idx} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoDetails;
