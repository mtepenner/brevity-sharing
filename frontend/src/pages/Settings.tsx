import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface SettingsProps {
  onLogout?: () => void;
}

interface SettingsState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  privateAccount: boolean;
  allowMessages: boolean;
  language: string;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const { darkMode, setDarkMode } = useTheme();

  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    pushNotifications: true,
    privateAccount: false,
    allowMessages: true,
    language: 'en',
  });

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key: keyof SettingsState, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  const Toggle: React.FC<{
    checked: boolean;
    onChange: () => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <label className="relative inline-flex items-center cursor-pointer" aria-label={label}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500" />
    </label>
  );

  return (
    <main className="w-full bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </header>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Display */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Display</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch to a darker colour scheme
                </p>
              </div>
              <Toggle
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                label="Dark Mode"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Language"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Privacy &amp; Safety
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Private Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Only approved users can see your posts
                </p>
              </div>
              <Toggle
                checked={settings.privateAccount}
                onChange={() => handleToggle('privateAccount')}
                label="Private Account"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Allow Direct Messages
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Let anyone send you messages
                </p>
              </div>
              <Toggle
                checked={settings.allowMessages}
                onChange={() => handleToggle('allowMessages')}
                label="Allow Direct Messages"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Email Notifications
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive email alerts</p>
              </div>
              <Toggle
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                label="Email Notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Push Notifications
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive browser notifications
                </p>
              </div>
              <Toggle
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                label="Push Notifications"
              />
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Account</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition text-left">
              Change Password
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition text-left">
              Download Your Data
            </button>
            <button className="w-full px-4 py-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg font-semibold transition text-left">
              Deactivate Account
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
              >
                Sign Out
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
};
