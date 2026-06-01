import { Home, Film, Music, Library } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const links = [
    { name: 'Home', icon: <Home size={18} />, path: '/' },
    { name: 'Shorts', icon: <Film size={18} />, path: '/shorts' },
    { name: 'Music', icon: <Music size={18} />, path: '/music' },
    { name: 'Library', icon: <Library size={18} />, path: '/library' },
  ];

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
      </div>
    </aside>
  );
};

export default Sidebar;
