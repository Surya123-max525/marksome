import { Link } from 'react-router-dom';
import ChannelAvatar from './ChannelAvatar';

const ChannelCard = ({ channel, staggerClass = '' }) => {
  const channelId = channel.id.channelId || channel.id;
  const { snippet } = channel;

  if (!channelId || typeof channelId === 'object') return null;

  return (
    <Link to={`/channel/${channelId}`} style={{ display: 'block' }}>
      <div className={`pro-card animate-slide-up flex flex-col items-center justify-center p-6 ${staggerClass}`} style={{opacity: 0, border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', backgroundColor: 'var(--bg-secondary)', height: '100%'}}>
        <div style={{ transform: 'scale(1.5)', margin: '16px 0' }}>
          <ChannelAvatar channelId={channelId} channelTitle={snippet.title} size="lg" />
        </div>
        <h3 className="card-title text-center mt-6 text-lg line-clamp-1" style={{width: '100%'}}>{snippet.title}</h3>
        <p className="text-gray text-sm mt-1">YouTube Channel</p>
        <button className="btn btn-primary mt-4" style={{width: '100%', maxWidth: '140px', padding: '8px 0'}}>Subscribe</button>
      </div>
    </Link>
  );
};

export default ChannelCard;
