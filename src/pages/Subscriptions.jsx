import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import ChannelCard from '../components/ChannelCard';
import { useNavigate } from 'react-router-dom';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubscriptions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setSubscriptions(data);
      }
      setLoading(false);
    };

    loadSubscriptions();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="page-title animate-slide-up mb-6">Your Subscriptions</h2>
        <div className="pro-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: '200px', borderRadius: 'var(--border-radius)' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-page p-6">
      <h2 className="page-title animate-slide-up mb-6">Your Subscriptions</h2>
      
      {subscriptions.length === 0 ? (
        <div className="flex-col items-center justify-center p-12 bg-zinc-900 rounded-lg text-center" style={{ border: '1px solid var(--border-color)' }}>
          <h3 className="text-xl font-bold mb-2">No subscriptions yet</h3>
          <p className="text-gray">Search for channels or browse videos to find creators you love.</p>
        </div>
      ) : (
        <div className="pro-grid">
          {subscriptions.map((sub, idx) => {
            // Mock the YouTube API response structure so ChannelCard can render it seamlessly
            const mockChannelObj = {
              id: { kind: 'youtube#channel', channelId: sub.channel_id },
              snippet: {
                title: sub.channel_title,
                thumbnails: {
                  medium: { url: sub.thumbnail_url }
                }
              }
            };
            
            const staggerNum = (idx % 5) + 1;
            return <ChannelCard key={sub.id} channel={mockChannelObj} staggerClass={`stagger-${staggerNum}`} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
