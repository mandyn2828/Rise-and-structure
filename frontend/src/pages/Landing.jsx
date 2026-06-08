import { Check, ArrowRight, Activity, Brain, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import hero from '../assets/hero.png';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-8 animate-in fade-in slide-in-from-bottom duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Now accepting new members for June
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom duration-700">
              You don't need <span className="text-secondary italic">another</span> app. <br />You need a system.
            </h1>
            <p className="text-text-secondary text-xl md:text-2xl leading-relaxed mb-12 max-w-xl animate-in fade-in slide-in-from-bottom duration-1000">
              Rise & Structure is the daily guidance system for mid-lifers who want to rebuild their health, income, and direction — without adding more decisions to their day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              <Link 
                to="/login" 
                className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 hover:shadow-2xl active:scale-95 text-center flex items-center justify-center gap-2"
              >
                Start Your Rebuild
                <ArrowRight size={24} />
              </Link>
              <div className="flex -space-x-3 items-center px-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-bg-soft flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
                <div className="pl-6 text-sm font-medium text-text-secondary">
                  <span className="text-text-primary font-bold">400+</span> ambitious adults joined this month
                </div>
              </div>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/20 to-accent-gold/20 rounded-[3rem] blur-3xl opacity-50 -z-10"></div>
            <div className="bg-white rounded-[2.5rem] border border-border shadow-2xl p-4 md:p-8">
               <img 
                src={hero} 
                alt="Structure and Health" 
                className="rounded-3xl w-full h-[400px] object-cover shadow-inner"
              />
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-bg-soft/50 rounded-2xl p-6 border border-border/50">
                  <div className="text-3xl font-heading text-primary mb-1">5-15</div>
                  <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">Minutes a day</div>
                </div>
                <div className="bg-bg-soft/50 rounded-2xl p-6 border border-border/50">
                  <div className="text-3xl font-heading text-secondary mb-1">100%</div>
                  <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">Guided System</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Pillars */}
      <section id="features" className="py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-heading text-4xl md:text-5xl text-text-primary mb-6">Three Pillars. One Foundation.</h2>
            <p className="text-text-secondary text-xl">We don't just help you work out. We help you rebuild your life structure across Health, Mindset, and Wealth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wellness */}
            <div className="group bg-bg-main rounded-[2rem] p-10 border border-border hover:border-primary/30 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-accent-green/10 text-accent-green rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <h3 className="font-heading text-2xl mb-4">Wellness</h3>
              <p className="text-text-secondary leading-relaxed mb-8">
                Daily 5-15 min routines for bodies over 35. Mobility, strength, and recovery that fits your real schedule.
              </p>
              <ul className="space-y-4">
                {['Morning mobility resets', 'Strength foundations', 'Nutrition habits'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-primary font-medium">
                    <div className="w-5 h-5 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center">
                      <Check size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mindset */}
            <div className="group bg-bg-main rounded-[2rem] p-10 border border-border hover:border-secondary/30 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Brain size={32} />
              </div>
              <h3 className="font-heading text-2xl mb-4">Mindset</h3>
              <p className="text-text-secondary leading-relaxed mb-8">
                Daily coaching prompts and reflections to quiet the inner critic and find clear direction in mid-life.
              </p>
              <ul className="space-y-4">
                {['Identity shift work', 'Purpose reconnection', 'Emotional resilience'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-primary font-medium">
                    <div className="w-5 h-5 bg-secondary/20 text-secondary rounded-full flex items-center justify-center">
                      <Check size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Finance */}
            <div className="group bg-bg-main rounded-[2rem] p-10 border border-border hover:border-accent-gold/30 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-accent-gold/10 text-accent-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <DollarSign size={32} />
              </div>
              <h3 className="font-heading text-2xl mb-4">Finance</h3>
              <p className="text-text-secondary leading-relaxed mb-8">
                Actionable 10-minute micro-lessons. Build side income, negotiate your salary, and master wealth basics.
              </p>
              <ul className="space-y-4">
                {['Side-income blueprints', 'Salary negotiation scripts', 'Investing foundations'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-primary font-medium">
                    <div className="w-5 h-5 bg-accent-gold/20 text-accent-gold rounded-full flex items-center justify-center">
                      <Check size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-bg-soft/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-heading text-4xl md:text-5xl text-text-primary mb-6">Choose the plan that fits your rebuild.</h2>
            <p className="text-text-secondary text-xl">Join hundreds of others taking back control of their daily life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Starter */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-border shadow-sm flex flex-col h-full">
              <div className="mb-8">
                <h3 className="font-heading text-2xl text-text-primary mb-2">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">$19</span>
                  <span className="text-text-muted">/month</span>
                </div>
                <p className="text-text-secondary mt-4">Best for: People ready to build foundations.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {['Daily wellness routines', 'Daily mindset prompts', '3x/week finance lessons', 'Habit tracking system', '7-day free trial'].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-text-primary text-sm">
                    <Check size={18} className="text-accent-green mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary/5 transition-colors">
                Start 7-Day Trial
              </Link>
            </div>

            {/* Builder */}
            <div className="bg-primary rounded-[2.5rem] p-10 shadow-2xl flex flex-col h-full transform scale-105 relative z-10 text-white">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                Recommended
              </div>
              <div className="mb-8">
                <h3 className="font-heading text-2xl text-white mb-2">Builder</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">$149</span>
                  <span className="opacity-60">/year</span>
                </div>
                <p className="opacity-80 mt-4 font-medium">Save 35% with annual billing.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  'Everything in Starter',
                  'Full 2-week rotation access',
                  'Weekly progress reviews',
                  'Early access to courses',
                  'Priority support'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white text-sm">
                    <Check size={18} className="text-accent-gold mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="w-full py-4 rounded-xl bg-white text-primary font-bold text-center hover:bg-bg-soft transition-colors shadow-lg">
                Get Yearly Access
              </Link>
              <div className="mt-4 text-center text-xs opacity-50 font-medium">Just $12.42 per month</div>
            </div>

            {/* Thriver */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-border shadow-sm flex flex-col h-full">
              <div className="mb-8">
                <h3 className="font-heading text-2xl text-text-primary mb-2">Thriver</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">$99</span>
                  <span className="text-text-muted">/month</span>
                </div>
                <p className="text-text-secondary mt-4">Best for: People ready to optimize with 1:1 support.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  'Everything in Builder',
                  '2 monthly 1:1 sessions',
                  'Personalized action plans',
                  'Quarterly progress deep-dive',
                  'Direct coach messaging'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-text-primary text-sm">
                    <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary/5 transition-colors">
                Apply for Thriver
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto bg-text-primary rounded-[3rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 opacity-50"></div>
          <div className="relative z-10 px-8 py-16 md:p-20 text-center">
            <h2 className="font-heading text-4xl md:text-6xl text-white mb-8 leading-tight">
              Ready to give your life <br className="hidden md:block" /> the structure it deserves?
            </h2>
            <p className="text-bg-soft/70 text-xl mb-12 max-w-2xl mx-auto">
              Join 400+ others who are rebuilding their health, income, and sense of direction one daily step at a time.
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-secondary text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-secondary-hover transition-all shadow-xl shadow-secondary/20 hover:shadow-2xl active:scale-95"
            >
              Get Started Now
            </Link>
            <p className="text-bg-soft/40 mt-8 text-sm font-medium">No commitment. Cancel anytime. 7-day free trial.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
