import { useState } from 'react';
import { Home, Film, Music, Library, Search, UserCheck } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const [channelSearch, setChannelSearch] = useState('');
  const navigate = useNavigate();

  const links = [
    { name: 'Home', icon: <Home size={18} />, path: '/' },
    { name: 'Shorts', icon: <Film size={18} />, path: '/shorts' },
    { name: 'Subscriptions', icon: <UserCheck size={18} />, path: '/subscriptions' },
    { name: 'Music', icon: <Music size={18} />, path: '/music' },
    { name: 'Library', icon: <Library size={18} />, path: '/library' },
  ];

  const handleChannelSearch = (e) => {
    e.preventDefault();
    if (channelSearch.trim()) {
      navigate(`/search/${channelSearch.trim()}`);
      setChannelSearch('');
    }
  };

  return (
    <aside className={`pro-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-section">
          {links.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path}
              className={({isActive}) => `sidebar-link flex items-center gap-3 ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-section channel-search-section" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <p className="section-title">Channels</p>
          <form onSubmit={handleChannelSearch} className="flex items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', padding: '6px 10px' }}>
            <Search size={14} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search channel" 
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%', marginLeft: '8px', outline: 'none' }}
            />
          </form>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
