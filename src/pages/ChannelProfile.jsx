import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChannelDetails, fetchChannelVideos } from '../utils/api';
import { supabase } from '../utils/supabaseClient';
import VideoCard from '../components/VideoCard';
import './ChannelProfile.css';

const ChannelProfile = () => {
  const { id } = useParams();
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Fetch channel details
      const details = await fetchChannelDetails(id);
      if (details?.items?.length > 0) {
        setChannelDetail(details.items[0]);
      }

      // Fetch channel videos
      const channelVideos = await fetchChannelVideos(id);
      if (channelVideos?.items) {
        setVideos(channelVideos.items);
      }

      // Check subscription status
      if (session?.user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('channel_id', id)
          .single();
        if (data) {
          setIsSubscribed(true);
        }
      }

      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleSubscribe = async () => {
    alert("OPEN REAL YOUTBE YOU FUCKI BRO");
    
    if (!user) return; // User must be logged in

    if (isSubscribed) {
      // Unsubscribe
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('channel_id', id);
      if (!error) setIsSubscribed(false);
    } else {
      // Subscribe
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ 
          user_id: user.id, 
          channel_id: id, 
          channel_title: channelDetail?.snippet?.title,
          thumbnail_url: channelDetail?.snippet?.thumbnails?.medium?.url 
        }]);
      if (!error) setIsSubscribed(true);
    }
  };

  if (loading) {
    return (
      <div className="channel-profile-page">
        <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: 'var(--border-radius)' }}></div>
        <div className="flex gap-4 mt-4 p-4">
          <div className="skeleton" style={{ height: '100px', width: '100px', borderRadius: '50%' }}></div>
          <div className="flex-col" style={{ flex: 1 }}>
             <div className="skeleton mt-4" style={{ height: '30px', width: '200px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!channelDetail) return <div className="p-4">Channel not found.</div>;

  return (
    <div className="channel-profile-page">
      {/* Banner */}
      {channelDetail?.brandingSettings?.image?.bannerExternalUrl && (
        <div className="channel-banner">
          <img src={channelDetail.brandingSettings.image.bannerExternalUrl} alt="Channel Banner" />
        </div>
      )}

      {/* Profile Header */}
      <div className="channel-header-glass flex items-center p-8">
        <img 
          src={channelDetail?.snippet?.thumbnails?.medium?.url} 
          alt={channelDetail?.snippet?.title} 
          className="channel-avatar-huge"
        />
        <div className="channel-info-main flex-col ml-8">
          <h1 className="text-4xl font-extrabold tracking-tight">{channelDetail?.snippet?.title}</h1>
          <p className="text-gray mt-2 font-medium">
            {parseInt(channelDetail?.statistics?.subscriberCount).toLocaleString()} subscribers &bull; 
            {' '}{channelDetail?.statistics?.videoCount} videos
          </p>
          <button 
            className={`btn mt-5 ${isSubscribed ? 'btn-subscribed text-white' : 'btn-primary btn-subscribe'}`} 
            onClick={handleSubscribe}
            style={{ padding: '10px 28px', borderRadius: '30px' }}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
      </div>

      {/* Videos Section */}
      <div className="p-6">
        <h2 className="mb-6 text-xl font-bold">Videos</h2>
        <div className="pro-grid">
          {videos.map((video, idx) => {
            const staggerNum = (idx % 5) + 1;
            return <VideoCard key={idx} video={video} staggerClass={`stagger-${staggerNum}`} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
