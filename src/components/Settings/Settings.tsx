import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, User, Shield, Bell, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(user?.role === 'admin' ? [{ id: 'system', label: 'System', icon: Database }] : [])
  ];

  const ProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed capitalize"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <input
              type="text"
              value={user?.department || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Security Settings</h3>
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Change Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Confirm new password"
              />
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { id: 'email_leaves', label: 'Email notifications for leave requests', enabled: true },
            { id: 'email_approvals', label: 'Email notifications for leave approvals', enabled: true },
            { id: 'email_holidays', label: 'Email notifications for new holidays', enabled: false },
            { id: 'push_attendance', label: 'Push notifications for attendance reminders', enabled: true },
            { id: 'push_deadlines', label: 'Push notifications for important deadlines', enabled: true }
          ].map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <label className="text-white font-medium">{setting.label}</label>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked={setting.enabled}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-yellow-400' : 'bg-gray-500'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Database Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Storage</span>
                <span className="text-green-400">localStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Users</span>
                <span className="text-white">{JSON.parse(localStorage.getItem('users') || '[]').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Leave Requests</span>
                <span className="text-white">{JSON.parse(localStorage.getItem('leaveRequests') || '[]').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Attendance Records</span>
                <span className="text-white">{JSON.parse(localStorage.getItem('attendanceRecords') || '[]').length}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">System Actions</h4>
            <div className="space-y-3">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Clear All Data
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Export Data
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Backup System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'system': return <SystemSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account preferences and system settings
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;