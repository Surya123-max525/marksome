import { useEffect, useState } from 'react';
import { fetchMusic } from '../utils/api';
import VideoCard from '../components/VideoCard';
import './Music.css';

const LANGUAGES = ['Global', 'English', 'Spanish', 'Korean', 'Hindi', 'Japanese'];

const Music = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('music_lang') || null);

  useEffect(() => {
    if (!language) return;
    
    const loadVideos = async () => {
      setLoading(true);
      const data = await fetchMusic(language);
      if (data?.items) {
        setVideos(data.items);
      }
      setLoading(false);
    };
    loadVideos();
  }, [language]);

  const selectLanguage = (lang) => {
    localStorage.setItem('music_lang', lang);
    setLanguage(lang);
  };

  if (!language) {
    return (
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh' }}>
        <h1 className="page-title mb-4 animate-slide-up">Choose Your Region</h1>
        <p className="text-gray mb-8 animate-slide-up stagger-1">Select your preferred language for music recommendations.</p>
        <div className="flex gap-4 flex-wrap justify-center animate-slide-up stagger-2" style={{ maxWidth: '600px' }}>
          {LANGUAGES.map((lang) => (
            <button 
              key={lang} 
              className="btn btn-primary"
              style={{ padding: '12px 24px', borderRadius: '24px', fontSize: '16px' }}
              onClick={() => selectLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="flex justify-between items-center mb-6">
        <h2 className="page-title">Trending Music: {language}</h2>
        <button className="btn" onClick={() => selectLanguage(null)}>Change Language</button>
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
            const staggerNum = (idx % 5) + 1;
            return <VideoCard video={video} key={idx} staggerClass={`stagger-${staggerNum}`} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Music;
