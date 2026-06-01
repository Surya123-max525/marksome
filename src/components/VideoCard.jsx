import { Link } from 'react-router-dom';
import moment from 'moment';
import ChannelAvatar from './ChannelAvatar';
import './VideoCard.css';

const VideoCard = ({ video, staggerClass = '' }) => {
  const videoId = video.id.videoId || video.id;
  const { snippet } = video;

  if (!videoId) return null;

  return (
    <div className={`pro-card animate-slide-up ${staggerClass}`} style={{opacity: 0}}>
      <Link to={`/video/${videoId}`} className="pro-card-link">
        <div className="thumbnail-wrapper">
          <img 
            src={snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url} 
            alt={snippet?.title} 
            className="thumbnail-img"
          />
          <div className="duration-badge">Live</div>
        </div>
        <div className="card-content flex mt-3 gap-3">
          <Link to={`/channel/${snippet?.channelId}`} onClick={(e) => e.stopPropagation()}>
            <ChannelAvatar channelId={snippet?.channelId} channelTitle={snippet?.channelTitle} size="md" />
          </Link>
          <div className="card-info flex flex-col">
            <h3 className="card-title line-clamp-2">{snippet?.title}</h3>
            <Link to={`/channel/${snippet?.channelId}`} onClick={(e) => e.stopPropagation()} className="card-channel text-sm text-gray mt-1 hover:text-white transition-colors">
              {snippet?.channelTitle}
            </Link>
            <p className="text-xs text-gray opacity-80">
              {moment(snippet?.publishedAt).fromNow()}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
