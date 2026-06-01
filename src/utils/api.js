import axios from 'axios';

const API_KEYS = [
  'AIzaSyAKsHepOYBuZqgkxg79IxtafJQVUamfeS0',
  'AIzaSyB31JwT7L-VvE3cMHKAPLY29iP4LepHqMA'
];
let currentKeyIndex = 0;

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

export const fetchFromAPI = async (url) => {
  let retries = API_KEYS.length;
  
  while (retries > 0) {
    try {
      const apiKey = API_KEYS[currentKeyIndex];
      const { data } = await axios.get(`${BASE_URL}/${url}&key=${apiKey}`);
      return data;
    } catch (e) {
      console.warn(`API key ${currentKeyIndex} failed: ${e.message}. Switching to next key...`);
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      retries--;
      if (retries === 0) {
        console.error("All YouTube API keys have failed or exceeded quota.");
        return null;
      }
    }
  }
  return null;
};

export const fetchVideos = async (query = 'new videos') => {
  const url = `search?part=snippet&q=${query}&maxResults=50&type=video,channel&safeSearch=strict`;
  return await fetchFromAPI(url);
};

export const fetchVideoDetails = async (videoId) => {
  const url = `videos?part=snippet,statistics&id=${videoId}`;
  return await fetchFromAPI(url);
};

export const fetchRelatedVideos = async () => {
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

export const fetchChannelDetails = async (channelId) => {
  const url = `channels?part=snippet,statistics,brandingSettings&id=${channelId}`;
  return await fetchFromAPI(url);
};

export const fetchChannelVideos = async (channelId) => {
  const url = `search?channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video&safeSearch=strict`;
  return await fetchFromAPI(url);
};

const channelCache = {};
let pendingChannelIds = new Set();
let fetchTimeout = null;
let resolveQueue = [];

export const fetchChannelIcon = (channelId) => {
  return new Promise((resolve) => {
    if (channelCache[channelId]) {
      return resolve(channelCache[channelId]);
    }

    pendingChannelIds.add(channelId);
    resolveQueue.push({ channelId, resolve });

    if (!fetchTimeout) {
      fetchTimeout = setTimeout(async () => {
        const idsToFetch = Array.from(pendingChannelIds);
        const currentQueue = [...resolveQueue];
        
        pendingChannelIds.clear();
        resolveQueue = [];
        fetchTimeout = null;

        for (let i = 0; i < idsToFetch.length; i += 50) {
          const chunk = idsToFetch.slice(i, i + 50).join(',');
          try {
            const data = await fetchFromAPI(`channels?part=snippet&id=${chunk}`);
            if (data?.items) {
              data.items.forEach(item => {
                channelCache[item.id] = item.snippet.thumbnails.default.url;
              });
            }
          } catch (e) {
            console.error(e);
          }
        }

        currentQueue.forEach(({ channelId, resolve }) => {
          resolve(channelCache[channelId] || null);
        });

      }, 50);
    }
  });
};
