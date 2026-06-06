import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-main font-body flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                R
              </div>
              <span className="font-heading font-semibold text-2xl text-primary tracking-tight">Rise & Structure</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/#features" className="text-text-secondary hover:text-primary transition-colors font-medium">Features</Link>
              <Link to="/#pricing" className="text-text-secondary hover:text-primary transition-colors font-medium">Pricing</Link>
              <Link to="/login" className="text-text-secondary hover:text-primary transition-colors font-medium">Login</Link>
              <Link 
                to="/login" 
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile Nav Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-border p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <Link to="/#features" className="block text-lg font-medium text-text-primary px-4 py-2 hover:bg-bg-soft rounded-lg" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link to="/#pricing" className="block text-lg font-medium text-text-primary px-4 py-2 hover:bg-bg-soft rounded-lg" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link to="/login" className="block text-lg font-medium text-text-primary px-4 py-2 hover:bg-bg-soft rounded-lg" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/login" className="block w-full text-center bg-primary text-white px-6 py-3 rounded-xl font-bold" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-text-primary text-bg-main py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="font-heading font-semibold text-xl text-white">Rise & Structure</span>
            </div>
            <p className="text-bg-soft/70 max-w-sm text-lg leading-relaxed">
              The daily guidance system for mid-lifers who want to rebuild their health, income, and direction.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-xl mb-6 text-white">Platform</h4>
            <ul className="space-y-4 text-bg-soft/60">
              <li><Link to="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Join Now</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-xl mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-bg-soft/60">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-bg-soft/40 text-sm">
          &copy; {new Date().getFullYear()} Rise & Structure. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
