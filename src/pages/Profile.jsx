import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UserCircle, Mail, Shield, Phone, Camera, Save, Lock, Edit3, X, Check } from 'lucide-react';

const API_URL = 'http://localhost:5000';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: '', text: '' });
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  if (!user) return null;

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    try {
      const { data } = await api.put('/auth/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ profilePicture: data.profilePicture });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const startEditing = () => {
    setEditForm({ name: user.name, email: user.email, phone: user.phone || '' });
    setEditing(true);
    setEditMessage({ type: '', text: '' });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/auth/profile', editForm);
      updateUser(data);
      setEditing(false);
      setEditMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setEditMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setEditLoading(false);
      setTimeout(() => setEditMessage({ type: '', text: '' }), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      {editMessage.text && (
        <div className={`mb-4 p-4 rounded-xl border max-w-3xl ${editMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <p className="text-sm font-medium">{editMessage.text}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl">
        {/* Cover */}
        <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 h-28 sm:h-36" />
        
        <div className="px-4 sm:px-6 lg:px-10 py-6 relative">
          {/* Avatar with upload */}
          <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6 lg:left-10">
            <div className="relative group">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
                {user.profilePicture ? (
                  <img src={`${API_URL}${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-full h-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-3xl sm:text-5xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
              >
                {uploading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Camera size={16} />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureUpload} className="hidden" />
            </div>
          </div>
          
          {/* Edit button */}
          <div className="flex justify-end">
            {!editing ? (
              <button onClick={startEditing} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                <Edit3 size={14} className="mr-1" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button onClick={() => setEditing(false)} className="flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                  <X size={14} className="mr-1" /> Cancel
                </button>
                <button onClick={handleEditSave} disabled={editLoading} className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                  {editLoading ? 'Saving...' : <><Check size={14} className="mr-1" /> Save</>}
                </button>
              </div>
            )}
          </div>

          {/* Name & Role */}
          <div className="mt-10 sm:mt-14">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
            <div className="mt-2">
              {user.role === 'admin' ? (
                <span className="inline-flex items-center text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg text-xs font-semibold border border-purple-200">
                  <Shield size={14} className="mr-1.5" /> Administrator
                </span>
              ) : (
                <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-lg text-xs font-semibold border border-green-200">
                  <UserCircle size={14} className="mr-1.5" /> Standard User
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <UserCircle size={16} className="mr-2 text-gray-400" /> Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail size={16} className="mr-2 text-gray-400" /> Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium break-all">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Shield size={16} className="mr-2 text-gray-400" /> Role
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone size={16} className="mr-2 text-gray-400" /> Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{user.phone || 'Not set'}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mt-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Lock size={20} className="text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>
            {!showPasswordForm && (
              <button onClick={() => setShowPasswordForm(true)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Change
              </button>
            )}
          </div>

          {passwordMessage.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {passwordMessage.text}
            </div>
          )}

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors outline-none"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" disabled={passwordLoading}
                  className="flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  <Save size={14} className="mr-1.5" /> {passwordLoading ? 'Changing...' : 'Update Password'}
                </button>
                <button type="button" onClick={() => { setShowPasswordForm(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
