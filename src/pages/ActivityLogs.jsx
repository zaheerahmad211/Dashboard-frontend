import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Activity, AlertTriangle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ACTION_COLORS = {
  LOGIN: 'bg-blue-100 text-blue-800',
  REGISTER: 'bg-green-100 text-green-800',
  LOGOUT: 'bg-gray-100 text-gray-800',
  PROFILE_UPDATE: 'bg-yellow-100 text-yellow-800',
  PASSWORD_CHANGE: 'bg-orange-100 text-orange-800',
  PROFILE_PICTURE_UPDATE: 'bg-purple-100 text-purple-800',
  USER_UPDATE: 'bg-indigo-100 text-indigo-800',
  USER_DELETE: 'bg-red-100 text-red-800',
  USER_ACTIVATE: 'bg-emerald-100 text-emerald-800',
  USER_DEACTIVATE: 'bg-rose-100 text-rose-800',
  SETTINGS_UPDATE: 'bg-teal-100 text-teal-800'
};

const ActivityLogs = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 15 };
        if (actionFilter !== 'all') params.action = actionFilter;
        const { data } = await api.get('/activity', { params });
        setLogs(data.logs);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchLogs();
    else setLoading(false);
  }, [user, page, actionFilter]);

  if (user?.role !== 'admin') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle size={32} className="mx-auto text-red-500 mb-3" />
          <h2 className="text-lg font-semibold text-red-700">Access Denied</h2>
          <p className="text-sm text-red-600 mt-1">Only administrators can view activity logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500 mt-1">Monitor all system activity and user actions.</p>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center space-x-3">
        <Filter size={16} className="text-gray-400" />
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="all">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="REGISTER">Register</option>
          <option value="PROFILE_UPDATE">Profile Update</option>
          <option value="PASSWORD_CHANGE">Password Change</option>
          <option value="USER_UPDATE">User Update</option>
          <option value="USER_DELETE">User Delete</option>
          <option value="USER_ACTIVATE">User Activate</option>
          <option value="USER_DEACTIVATE">User Deactivate</option>
          <option value="SETTINGS_UPDATE">Settings Update</option>
        </select>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-3" />
            Loading activity logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Activity size={32} className="mx-auto text-gray-300 mb-3" />
            No activity logs found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            {log.user?.profilePicture ? (
                              <img src={`http://localhost:5000${log.user.profilePicture}`} alt="" className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <span className="text-indigo-600 font-semibold text-xs">
                                {log.user?.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{log.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{log.user?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">{log.details}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
