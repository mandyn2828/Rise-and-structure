import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Check } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register';
  const [isRegister, setIsRegister] = useState(initialMode);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsRegister(true);
    } else if (mode === 'login') {
      setIsRegister(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.full_name);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col md:flex-row font-body">
      {/* Left Side: Brand/Value Prop */}
      <div className="hidden md:flex md:w-1/2 bg-primary text-white p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-bold text-2xl shadow-xl">R</div>
            <span className="font-heading text-3xl font-semibold tracking-tight">Rise & Structure</span>
          </div>
          
          <h2 className="font-heading text-5xl lg:text-7xl leading-tight mb-8">
            The foundation for your <span className="text-accent-gold italic">second act.</span>
          </h2>
          
          <div className="space-y-6">
            {[
              'Personalized daily guidance systems',
              'Wealth & income building micro-lessons',
              'Mindset coaching for mid-life clarity',
              'A community of ambitious peers'
            ].map(item => (
              <div key={item} className="flex items-center gap-4 text-xl opacity-90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
          <p className="text-white/60 font-medium">Join 400+ members rebuilding their lives today.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-bg-main">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-heading text-text-primary mb-3">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-text-secondary text-lg">
              {isRegister 
                ? 'Start your 7-day free trial today.' 
                : 'Sign in to continue your daily rebuild.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-medium animate-in shake duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-text-primary bg-white"
                  placeholder="Alex Johnson"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-text-primary bg-white"
                placeholder="alex@example.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-black uppercase tracking-widest text-text-muted">Password</label>
                {!isRegister && (
                  <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-text-primary bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            {isRegister && (
              <div className="flex items-start gap-3 ml-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 w-5 h-5 rounded-lg border-border text-primary focus:ring-primary transition-all cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-text-secondary leading-tight cursor-pointer">
                  I agree to the <a href="/terms" target="_blank" className="text-primary font-bold hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-primary font-bold hover:underline">Privacy Policy</a>.
                </label>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              {isRegister ? 'Start Free Trial' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-border text-center">
            <p className="text-text-secondary font-medium">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
              <button 
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isRegister ? 'Sign in instead' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
