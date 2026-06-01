import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Menu, User } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const term = searchTerm.trim();
      let history = JSON.parse(localStorage.getItem('user_search_history') || '[]');
      history = history.filter(t => t.toLowerCase() !== term.toLowerCase());
      history.unshift(term);
      history = history.slice(0, 5);
      localStorage.setItem('user_search_history', JSON.stringify(history));

      navigate(`/search/${term}`);
      setSearchTerm('');
    }
  };

  const handleAuthClick = async () => {
    if (user) await supabase.auth.signOut();
    else navigate('/auth');
  };

  return (
    <nav className="pro-navbar flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button className="icon-btn" onClick={toggleSidebar}><Menu size={20} /></button>
        <Link to="/" className="flex items-center gap-2">
          <span className="brand-logo" style={{ color: '#6366f1' }}>AuraStream</span>
        </Link>
      </div>

      <div className="search-container">
        <form className="pro-search-form flex items-center" onSubmit={handleSearch}>
          <Search size={16} className="text-gray ml-3" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="auth-btn flex items-center gap-2" onClick={handleAuthClick}>
          {user ? (
            <>
              <div className="avatar-micro">{user.email[0].toUpperCase()}</div>
              <span className="text-sm hidden-mobile">Sign Out</span>
            </>
          ) : (
            <>
              <User size={18} />
              <span className="text-sm hidden-mobile">Sign In</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
