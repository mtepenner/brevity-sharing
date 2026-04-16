import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar, BottomNav } from './components/Nav';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Messages } from './pages/Messages';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';
import { User, Page } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">✨</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user) return null;
    switch (currentPage) {
      case 'home':
        return <Home user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />;
      case 'explore':
        return <Explore />;
      case 'messages':
        return <Messages user={user} />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile user={user} />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      default:
        return <Home user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      {user ? (
        <div className="min-h-screen pb-16 sm:pb-0">
          <div className="max-w-5xl mx-auto flex min-h-screen">
            {/* Sidebar – visible on sm+ */}
            <aside className="hidden sm:block w-16 lg:w-64 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-gray-100 dark:border-gray-800">
              <Sidebar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                user={user}
                onLogout={handleLogout}
              />
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">{renderPage()}</main>
          </div>

          {/* Bottom nav – mobile only */}
          <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-inset-bottom">
            <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
          </nav>
        </div>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
};

export default App;

