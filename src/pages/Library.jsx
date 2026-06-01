import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { supabase } from '../utils/supabaseClient';

const Library = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Fetch history from last 7 days, ordered by viewed_at descending
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data, error } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('viewed_at', sevenDaysAgo.toISOString())
          .order('viewed_at', { ascending: false });
          
        if (!error && data) {
          // Filter out duplicates (keep only most recent view per video)
          const uniqueHistory = data.filter((v, i, a) => a.findIndex(t => (t.video_id === v.video_id)) === i);
          setHistory(uniqueHistory);
        }
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id);
    
    if (!error) {
      setHistory([]);
    } else {
      console.error("Failed to clear history:", error);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="pro-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="flex justify-between items-center mb-6">
        <h2 className="page-title">Watch History (Last 7 Days)</h2>
        {user && history.length > 0 && (
          <button className="btn" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>
      
      {!user ? (
        <div className="mt-4">
          <p className="text-gray mb-4">You need to sign in to track and view your watch history.</p>
          <Link to="/auth" className="btn btn-primary">Sign In</Link>
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray mt-4 animate-slide-up">You haven't watched any videos recently.</p>
      ) : (
        <div className="pro-list">
          {history.map((item, idx) => {
            const staggerNum = (idx % 5) + 1;
            return (
              <div key={item.id} className={`pro-card-horizontal animate-slide-up stagger-${staggerNum}`} style={{ opacity: 0 }}>
                <Link to={`/video/${item.video_id}`} className="pro-card-link">
                  <div className="thumbnail-wrapper">
                    <img src={item.thumbnail_url} alt={item.title} className="thumbnail-img" />
                  </div>
                  <div className="pro-card-info">
                    <h3 className="pro-card-title">{item.title}</h3>
                    <p className="pro-card-channel">{item.channel_title}</p>
                    <p className="pro-card-meta">Watched {moment(item.viewed_at).fromNow()}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Library;
