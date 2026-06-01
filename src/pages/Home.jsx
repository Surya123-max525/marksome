import { useEffect, useState } from 'react';
import { fetchVideos } from '../utils/api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchVideos('programming design technology');
      if (data?.items) {
        setVideos(data.items);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="home-page">
      <div className="page-header mb-4">
        <h1 className="page-title">Recommended</h1>
      </div>

      {loading ? (
        <div className="pro-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }}></div>
          ))}
        </div>
      ) : (
        <div className="pro-grid">
          {videos.map((video, idx) => {
            // Apply stagger effect up to 5 items, then loop
            const staggerNum = (idx % 5) + 1;
            return <VideoCard video={video} key={idx} staggerClass={`stagger-${staggerNum}`} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
