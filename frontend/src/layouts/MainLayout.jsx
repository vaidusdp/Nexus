import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, UserPlus, Zap, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore'; 

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); 
    alert("Logged out of the Nexus cluster.");
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ...(!isAuthenticated ? [
      { name: 'Login', path: '/login', icon: LogIn },
      { name: 'Register', path: '/register', icon: UserPlus },
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-vexor-bg flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-800 bg-vexor-card/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-vexor-accent p-1.5 rounded-lg">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-wider font-sans">NEXUS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center font-bold text-vexor-accent uppercase">
            {isAuthenticated && user ? user.username?.substring(0, 1) : 'G'}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-[#0d0d0d] hidden md:flex flex-col justify-between py-6 shrink-0 h-full">
          {/* Top Links Content Wrapper */}
          <div className="px-4">
            <nav className="space-y-2">
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
          </div>
          
          {/* Bottom Controls / Session Management Display */}
          <div className="mt-auto">
            {isAuthenticated && user ? (
              <div className="px-4 space-y-4">
                {/* Dynamic User Profile Snapshot */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-vexor-card/40 border border-gray-800 mx-1">
                  <div className="w-9 h-9 bg-vexor-accent/10 border border-vexor-accent/30 rounded-md flex items-center justify-center font-bold text-vexor-accent uppercase shadow-inner shrink-0">
                    {user.username?.substring(0, 2)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{user.username}</span>
                    <span className="text-xs text-vexor-accent font-medium">Level {user.nexusLevel || 1}</span>
                  </div>
                </div>

                {/* Secure Account Session Break Trigger */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors font-medium text-sm text-left"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Sign Out Identity</span>
                </button>
              </div>
            ) : (
              /* Public Upsell Advertisement Panel Widget */
              <div className="px-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-vexor-card to-[#1a1a1a] border border-gray-800 mx-1">
                  <p className="text-sm text-gray-300 font-medium mb-2">Vexor Pro</p>
                  <p className="text-xs text-gray-500 mb-3">Unlock premium lobbies and 0 ping routing.</p>
                  <button className="text-xs font-semibold text-vexor-accent hover:text-white transition-colors">
                    Upgrade Now &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Dynamic Outlet Render Canvas Context */}
        <main className="flex-1 overflow-y-auto relative p-6 md:p-10 bg-vexor-bg">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}