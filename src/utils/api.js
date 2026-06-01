import axios from 'axios';

const API_KEY = 'AIzaSyAM8zghSU60PtCtTFrQPo3YPllHNeaFHH0';
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}&key=${API_KEY}`);
    return data;
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    return null;
  }
};

export const fetchVideos = async (query = 'new videos') => {
  const url = `search?part=snippet&q=${query}&maxResults=50&type=video&safeSearch=strict`;
  return await fetchFromAPI(url);
};

export const fetchVideoDetails = async (videoId) => {
  const url = `videos?part=snippet,statistics&id=${videoId}`;
  return await fetchFromAPI(url);
};

export const fetchRelatedVideos = async (videoId) => {
  const url = `search?part=snippet&q=recommended&type=video&maxResults=20&safeSearch=strict`;
  return await fetchFromAPI(url);
};

export const fetchMusic = async (language = 'Global') => {
  const query = language === 'Global' ? 'latest popular music videos Vevo' : `latest ${language} popular music videos Vevo`;
  const url = `search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=50&safeSearch=strict`;
  return await fetchFromAPI(url);
};

export const fetchShorts = async () => {
  const url = `search?part=snippet&q=%23shorts&maxResults=30&type=video&safeSearch=strict`;
  return await fetchFromAPI(url);
};
