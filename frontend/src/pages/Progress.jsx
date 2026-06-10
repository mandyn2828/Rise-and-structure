import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, Calendar, CheckCircle2, Zap, BarChart3 } from 'lucide-react';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';

const Progress = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/user/stats`),
        axios.get(`${API_URL}/user/history`)
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error('Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-body text-text-secondary text-xl">Analyzing your transformation...</div>;

  // Calculate total completions
  const totalCompletions = stats?.pillars?.reduce((acc, p) => acc + p.completed, 0) || 0;
  
  // Last 7 days chart data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayData = history.find(h => h.date === dateStr);
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayData ? dayData.count : 0,
      fullDate: dateStr
    };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="max-w-6xl mx-auto font-body">
      <header className="mb-12">
        <h1 className="text-4xl font-heading text-primary mb-2">Your Transformation</h1>
        <p className="text-text-secondary text-lg">Visualizing your path to a structured life.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
              <Zap size={24} className="fill-secondary" />
            </div>
            <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-xs">Current Streak</span>
          </div>
          <div className="text-5xl font-heading text-primary">{stats?.streak || 0} Days</div>
          <p className="text-text-secondary mt-2 font-medium">Keep the momentum alive.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent-green/10 text-accent-green rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-xs">Total Rebuilds</span>
          </div>
          <div className="text-5xl font-heading text-primary">{totalCompletions}</div>
          <p className="text-text-secondary mt-2 font-medium">Small wins lead to big changes.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center">
              <Award size={24} />
            </div>
            <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-xs">Current Tier</span>
          </div>
          <div className="text-4xl font-heading text-primary uppercase tracking-tight">{user?.tier || 'Starter'}</div>
          <p className="text-text-secondary mt-2 font-medium">Elevate your potential.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <section className="bg-white p-10 rounded-[3rem] border border-border shadow-sm">
          <h2 className="text-2xl font-heading text-primary mb-10 flex items-center gap-3">
            <BarChart3 size={24} className="text-secondary" />
            7-Day Activity
          </h2>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {last7Days.map((day) => (
              <div key={day.fullDate} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full flex flex-col justify-end h-48">
                   <div 
                    className="w-full bg-primary/10 rounded-t-xl transition-all duration-500 group-hover:bg-primary/20 relative"
                    style={{ height: `${(day.count / maxCount) * 100}%` }}
                   >
                     {day.count > 0 && (
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                         {day.count}
                       </div>
                     )}
                   </div>
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-10 rounded-[3rem] border border-border shadow-sm">
          <h2 className="text-2xl font-heading text-primary mb-10 flex items-center gap-3">
            <TrendingUp size={24} className="text-accent-green" />
            Pillar Mastery
          </h2>
          <div className="space-y-8">
            {stats?.pillars.map((p) => {
              const percent = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
              return (
                <div key={p.pillar}>
                  <div className="flex justify-between text-sm mb-3 font-heading font-bold uppercase tracking-widest text-text-secondary">
                    <span>{p.pillar}</span>
                    <span className="text-lg text-primary">{percent}%</span>
                  </div>
                  <div className="h-4 bg-bg-soft rounded-full overflow-hidden border border-border p-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        p.pillar === 'wellness' ? 'bg-accent-green' : 
                        p.pillar === 'mindset' ? 'bg-accent-blue' : 
                        'bg-accent-gold'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="bg-bg-soft p-12 rounded-[3rem] border border-border mb-12">
        <h2 className="text-2xl font-heading text-primary mb-8 flex items-center gap-3">
          <Calendar size={24} className="text-secondary" />
          Recent Achievements
        </h2>
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((h) => (
              <div key={h.date} className="bg-white p-6 rounded-2xl border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">Completed {h.count} tasks</p>
                    <p className="text-xs text-text-muted">{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="bg-bg-soft px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Consistency ++
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-text-muted italic text-lg">No history recorded yet. Complete your first task to start your journey!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Progress;
