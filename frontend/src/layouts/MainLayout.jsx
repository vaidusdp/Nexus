import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, UserPlus, Zap, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore'; // 🌟 Connect our Zustand store

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🌟 Pluck session variables and the logout action from Zustand
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); // Wipes cookies and drops global RAM state to defaults
    alert("Logged out of the Nexus cluster.");
    navigate('/login');
  };

  // 🌟 DYNAMIC FILTER: If authenticated, filter out the login/register paths completely
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ...(!isAuthenticated ? [
      { name: 'Login', path: '/login', icon: LogIn },
      { name: 'Register', path: '/register', icon: UserPlus },
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-vexor-bg flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-800 bg-vexor-card/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-vexor-accent p-1.5 rounded-lg">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-wider font-sans">NEXUS</span>
        </div>
        
        {/* Navbar Profile Icon Group */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center font-bold text-vexor-accent uppercase">
            {/* 🌟 Dynamic Header Indicator */}
            {isAuthenticated && user ? user.username?.substring(0, 1) : 'G'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-[#0d0d0d] hidden md:flex flex-col py-6">
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-vexor-accent/10 text-vexor-accent' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-vexor-accent' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* 🌟 USER METADATA OR UPGRADE UPSELL PANEL */}
          {isAuthenticated && user ? (
            <div className="px-4 mt-auto space-y-4">
              {/* Dynamic User Banner */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-vexor-card/40 border border-gray-800">
                <div className="w-9 h-9 bg-vexor-accent/10 border border-vexor-accent/30 rounded-md flex items-center justify-center font-bold text-vexor-accent uppercase shadow-inner">
                  {user.username?.substring(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">{user.username}</span>
                  <span className="text-xs text-vexor-accent font-medium">Level {user.nexusLevel || 1}</span>
                </div>
              </div>

              {/* Functional Log Out Control */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors font-medium text-sm text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out Identity</span>
              </button>
            </div>
          ) : (
            // Default Upsell component for guest/unlogged routes
            <div className="px-8 mt-auto">
              <div className="p-4 rounded-lg bg-gradient-to-br from-vexor-card to-[#1a1a1a] border border-gray-800">
                <p className="text-sm text-gray-300 font-medium mb-2">Vexor Pro</p>
                <p className="text-xs text-gray-500 mb-3">Unlock premium lobbies and 0 ping routing.</p>
                <button className="text-xs font-semibold text-vexor-accent hover:text-white transition-colors">
                  Upgrade Now &rarr;
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}