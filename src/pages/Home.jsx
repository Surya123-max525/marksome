import { useEffect, useState } from 'react';
import { fetchVideos } from '../utils/api';
import VideoCard from '../components/VideoCard';
import ChannelCard from '../components/ChannelCard';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      let query = 'trending new popular';
      const historyStr = localStorage.getItem('user_search_history');
      if (historyStr) {
        try {
          const history = JSON.parse(historyStr);
          if (history && history.length > 0) {
            query = history.join(' ');
          }
        } catch (e) {
          console.error('Error parsing search history', e);
        }
      }

      const data = await fetchVideos(query);
      if (data?.items) {
        setVideos(data.items);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-4"><div className="skeleton" style={{height: '100vh', width: '100%'}}></div></div>;

  return (
    <div className="home-page">
      <h2 className="page-title animate-slide-up">Recommended</h2>
      <div className="pro-grid">
        {videos.map((item, idx) => {
          const staggerNum = (idx % 5) + 1;
          if (item.id?.kind === 'youtube#channel') {
            return <ChannelCard key={idx} channel={item} staggerClass={`stagger-${staggerNum}`} />;
          }
          return <VideoCard key={idx} video={item} staggerClass={`stagger-${staggerNum}`} />;
        })}
      </div>
    </div>
  );
};

export default Home;
