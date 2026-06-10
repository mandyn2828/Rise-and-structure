import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BookOpen, Settings, User, LogOut, Menu, X, Heart, DollarSign, Brain, Users, ShoppingBag, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transformation', path: '/dashboard/progress', icon: TrendingUp },
    { name: 'My Plan', path: '/dashboard/plan', icon: BookOpen },
    { name: 'Wellness', path: '/dashboard/wellness', icon: Heart },
    { name: 'Finance', path: '/dashboard/finance', icon: DollarSign },
    { name: 'Mindset', path: '/dashboard/mindset', icon: Brain },
    { name: 'Community', path: '/dashboard/community', icon: Users },
    { name: 'Connection Map', path: '/dashboard/map', icon: MapIcon },
    { name: 'Store', path: '/store', icon: ShoppingBag },
  ];

  const bottomLinks = [
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-body">
      {/* Navigation */}
      <header className="bg-bg-card h-16 border-b border-border flex items-center px-4 md:px-8 justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden p-2 text-text-secondary hover:bg-bg-soft rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <img src={logo} alt="" className="w-8 h-8 object-contain" />
          <span className="font-heading font-semibold text-xl text-primary tracking-tight">Rise & Structure</span>
        </div>
        
        <Link to="/dashboard/settings" className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity group">
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-sm font-bold text-text-primary leading-none group-hover:text-primary transition-colors">{user?.full_name}</span>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">{user?.tier} tier</span>
          </div>
          <div className="p-2 text-text-secondary hover:bg-bg-soft rounded-full transition-colors border border-transparent group-hover:border-primary/20 group-hover:bg-primary/5">
            <User size={20} />
          </div>
        </Link>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 bg-bg-card border-r border-border hidden lg:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
          <Link 
            to="/dashboard/settings" 
            className="mb-8 p-4 bg-bg-soft/30 rounded-2xl border border-border hover:border-primary/20 hover:bg-bg-soft/50 transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-primary/10">
              <User size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">{user?.full_name}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-black">{user?.tier} tier</span>
            </div>
          </Link>
          <div className="flex-1 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary/5 text-primary font-bold' 
                      : 'text-text-secondary hover:bg-bg-soft hover:text-text-primary'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-text-muted'} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-border space-y-1">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="flex items-center gap-3 p-3 text-text-secondary hover:bg-bg-soft rounded-lg transition-all"
                >
                  <Icon size={20} className="text-text-muted" />
                  {link.name}
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-error-rust hover:bg-red-50 rounded-lg transition-all font-medium"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="absolute inset-y-0 left-0 w-72 bg-bg-card shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="" className="w-8 h-8 object-contain" />
                  <span className="font-heading font-semibold text-lg text-primary">Rise & Structure</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>

              <Link 
                to="/dashboard/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mb-8 p-4 bg-bg-soft rounded-2xl flex items-center gap-4 hover:bg-bg-soft/80 transition-all border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-text-primary">{user?.full_name}</p>
                  <p className="text-xs text-text-muted uppercase tracking-widest font-black">{user?.tier} tier</p>
                </div>
              </Link>

              <div className="flex-1 space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 text-lg text-text-secondary hover:bg-bg-soft rounded-xl transition-all"
                  >
                    <link.icon size={24} />
                    {link.name}
                  </Link>
                ))}
              </div>
              <button 
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 p-4 text-lg text-error-rust font-bold"
              >
                <LogOut size={24} />
                Sign Out
              </button>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
