import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VideoDetails from './pages/VideoDetails';
import Search from './pages/Search';
import Shorts from './pages/Shorts';
import Library from './pages/Library';
import Auth from './pages/Auth';
import Music from './pages/Music';
import { supabase } from './utils/supabaseClient';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading AuraStream...</div>;
  }

  // If not logged in and trying to access anything other than /auth, redirect to /auth
  if (!session && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  // If logged in and trying to access /auth, redirect to home
  if (session && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`app-container ${!session ? 'auth-mode' : ''} ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      {session && <Navbar toggleSidebar={toggleSidebar} />}
      {session && <Sidebar isOpen={sidebarOpen} />}
      
      <main className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoDetails />} />
          <Route path="/search/:searchTerm" element={<Search />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/library" element={<Library />} />
          <Route path="/music" element={<Music />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
