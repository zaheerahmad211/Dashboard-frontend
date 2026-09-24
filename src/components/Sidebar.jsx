import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, UserCircle, X, Shield, Settings, Activity } from 'lucide-react';

const API_URL = 'http://localhost:5000';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
  ];

  const adminItems = [
    { name: 'Activity Logs', path: '/activity', icon: <Activity size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo / Brand */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">SecureAdmin</span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Label */}
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <>
              <div className="px-3 pt-6 pb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</h2>
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer with User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              {user?.profilePicture ? (
                <img src={`${API_URL}${user.profilePicture}`} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center">© 2026 SecureAdmin</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
