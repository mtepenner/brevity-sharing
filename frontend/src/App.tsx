import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">✨</div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 flex justify-center w-full">
      {user ? (
        <>
          {/* FUTURE: Left Sidebar Navigation
            <nav className="hidden sm:flex w-64 flex-col p-4">...</nav> 
          */}

          {/* Main Content Area */}
          <Home user={user} onLogout={handleLogout} />

          {/* FUTURE: Right Sidebar (Trending, Who to follow)
            <aside className="hidden lg:block w-80 p-4">...</aside> 
          */}
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
