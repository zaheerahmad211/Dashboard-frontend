import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Shield, Activity, Database, UserPlus, TrendingUp, UserX, Clock, Settings, FileText } from 'lucide-react';
import api from '../services/api';

const API_URL = 'http://localhost:5000';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, adminUsers: 0, activeUsers: 0, inactiveUsers: 0, newThisMonth: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/activity/recent').catch(() => ({ data: [] }))
        ]);
        setStats(statsRes.data);
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: loading ? '...' : stats.totalUsers, icon: <Users size={24} className="text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Admin Users', value: loading ? '...' : stats.adminUsers, icon: <Shield size={24} className="text-indigo-600" />, bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { title: 'Active Users', value: loading ? '...' : stats.activeUsers, icon: <Activity size={24} className="text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Inactive Users', value: loading ? '...' : stats.inactiveUsers, icon: <UserX size={24} className="text-red-600" />, bg: 'bg-red-50', border: 'border-red-100' },
    { title: 'New This Month', value: loading ? '...' : stats.newThisMonth, icon: <TrendingUp size={24} className="text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'System Status', value: 'Online', icon: <Database size={24} className="text-teal-600" />, bg: 'bg-teal-50', border: 'border-teal-100' },
  ];

  const quickActions = [
    { name: 'Manage Users', path: '/users', icon: <Users size={20} />, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { name: 'Activity Logs', path: '/activity', icon: <FileText size={20} />, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, color: 'text-gray-600 bg-gray-100 hover:bg-gray-200' },
    { name: 'My Profile', path: '/profile', icon: <UserPlus size={20} />, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, <span className="font-medium text-gray-700">{user?.name}</span>. Here's your system overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className={`p-3 rounded-xl ${card.bg} border ${card.border}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock size={20} className="mr-2 text-gray-400" /> Recent Activity
              </h2>
              {user?.role === 'admin' && (
                <Link to="/activity" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All →</Link>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
            ) : (
              recentActivity.slice(0, 7).map((log) => (
                <div key={log._id} className="px-5 sm:px-6 py-3 flex items-center space-x-3 hover:bg-gray-50/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {log.user?.profilePicture ? (
                      <img src={`${API_URL}${log.user.profilePicture}`} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-indigo-600 font-semibold text-xs">{log.user?.name?.charAt(0)?.toUpperCase() || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      <span className="font-medium">{log.user?.name || 'Unknown'}</span>{' '}
                      <span className="text-gray-500">— {log.details}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${action.color}`}
              >
                <span className="mr-3">{action.icon}</span>
                {action.name}
              </Link>
            ))}
          </div>

          {/* Auth Info */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">Session Info</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-2 font-mono">
              <p><strong className="text-gray-900">Role:</strong> <span className="capitalize">{user?.role}</span></p>
              <p className="break-all"><strong className="text-gray-900">Email:</strong> {user?.email}</p>
              <p>
                <strong className="text-gray-900">Token:</strong>{' '}
                <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse" />
                  Active
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
