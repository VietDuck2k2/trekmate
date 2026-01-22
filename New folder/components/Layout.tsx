
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  transparentNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, transparentNav = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = transparentNav && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm';

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen font-jakarta">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 ${navClasses}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <span className={`material-icons-outlined text-3xl ${transparentNav && !scrolled ? 'text-white' : 'text-primary'}`}>terrain</span>
            <span className={`text-2xl font-bold font-display tracking-tight ${transparentNav && !scrolled ? 'text-white' : 'text-primary'}`}>TrekMate</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link to="/home" className={`hover:text-primary transition-colors ${isActive('/home') ? 'text-primary' : ''}`}>Trips</Link>
            <Link to="/ads" className={`hover:text-primary transition-colors ${isActive('/ads') ? 'text-primary' : ''}`}>Ads</Link>
            <Link to="/dashboard" className={`hover:text-primary transition-colors ${isActive('/dashboard') ? 'text-primary' : ''}`}>My Trips</Link>
            <Link to="/profile" className={`hover:text-primary transition-colors ${isActive('/profile') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>Profile</Link>
            <Link to="/create" className={`px-5 py-2.5 rounded-full font-semibold transition-all ${transparentNav && !scrolled ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}>Create Trip</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <Link to="/profile" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">D</Link>
              <span className={`hidden lg:inline font-semibold ${transparentNav && !scrolled ? 'text-white' : 'text-slate-800 dark:text-white'}`}>Duc Dep Trai</span>
              <button onClick={() => navigate('/login')} className="hover:text-red-400 transition-colors ml-2">
                <span className="material-icons-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <span className="material-icons-outlined text-2xl text-primary">terrain</span>
            <span className="text-xl font-bold font-display tracking-tight">TrekMate</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Help</a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2024 TrekMate. Nature awaits.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
