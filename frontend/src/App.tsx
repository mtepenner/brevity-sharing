import React from 'react';
import { Home } from './pages/Home';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center w-full">
      
      {/* FUTURE: Left Sidebar Navigation
        <nav className="hidden sm:flex w-64 flex-col p-4">...</nav> 
      */}

      {/* Main Content Area */}
      <Home />

      {/* FUTURE: Right Sidebar (Trending, Who to follow)
        <aside className="hidden lg:block w-80 p-4">...</aside> 
      */}

    </div>
  );
};

export default App;
