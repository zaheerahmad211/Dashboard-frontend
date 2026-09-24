import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Settings as SettingsIcon, Save, Globe, Users, Clock, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    siteName: 'SecureAdmin',
    allowRegistration: true,
    maxUsersLimit: 100,
    maintenanceMode: false,
    sessionTimeout: 24
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchSettings();
    else setLoading(false);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/settings', settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle size={32} className="mx-auto text-red-500 mb-3" />
          <h2 className="text-lg font-semibold text-red-700">Access Denied</h2>
          <p className="text-sm text-red-600 mt-1">Only administrators can access system settings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-3" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your admin dashboard preferences.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* Site Name */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Globe size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">General</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
            />
          </div>
        </div>

        {/* Registration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Users size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Allow Registration</p>
                <p className="text-xs text-gray-500">Enable or disable public user registration</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowRegistration ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Users Limit</label>
              <input
                type="number"
                value={settings.maxUsersLimit}
                onChange={(e) => setSettings({ ...settings, maxUsersLimit: parseInt(e.target.value) || 0 })}
                className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
              />
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Session</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Timeout (hours)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 1 })}
                className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Put the application in maintenance mode</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm transition-all duration-200 ${
              saving ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-indigo-200'
            }`}
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
