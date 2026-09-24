import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, User, Menu, Settings, UserCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="font-semibold text-xl text-indigo-600 tracking-tight lg:hidden">SecureAdmin</div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              {user?.profilePicture ? (
                <img src={`${API_URL}${user.profilePicture}`} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="text-indigo-600 font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase() || '?'}</span>
              )}
            </div>
            <span className="hidden sm:inline text-sm font-medium">{user?.name || 'User'}</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <UserCircle size={16} className="mr-2 text-gray-400" /> My Profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/settings" onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={16} className="mr-2 text-gray-400" /> Settings
                </Link>
              )}
              <div className="border-t border-gray-100">
                <button onClick={() => { setDropdownOpen(false); logout(); }}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
