import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, Circle, ArrowRight, Flame, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api/config';

const Dashboard = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [planRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/daily-plan`),
        axios.get(`${API_URL}/user/stats`)
      ]);
      setPlan(planRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await axios.post(`${API_URL}/tasks/${taskId}/complete`, { notes: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to complete task');
    }
  };

  if (loading) return <div className="p-8 text-center font-body text-text-secondary text-xl">Building your day...</div>;

  const completedCount = plan?.tasks?.filter(t => t.completed).length || 0;
  const totalCount = plan?.tasks?.length || 0;

  return (
    <div className="max-w-5xl mx-auto font-body">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading text-primary mb-2">Good morning, {user?.full_name?.split(' ')[0] || 'Alex'}</h1>
          <p className="text-text-secondary text-lg">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. 
            You have {totalCount - completedCount} tasks to rebuild today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-border shadow-sm">
            <Flame size={24} className="text-secondary fill-secondary" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-text-primary leading-none text-2xl">{stats?.streak || 0}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">day streak</span>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg active:scale-95">
            Start Session
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Daily Plan */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-bg-card p-1 md:p-2 rounded-3xl border border-border shadow-xl">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-heading text-primary mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-secondary rounded-full"></div>
                Today's Focus
              </h2>
              <div className="space-y-4">
                {plan?.tasks?.map((task) => (
                  <div key={task.id} className={`group rounded-2xl border transition-all duration-300 ${
                    task.completed 
                      ? 'bg-bg-main/50 border-accent-green/20 opacity-75' 
                      : 'bg-white border-border hover:border-primary/30 hover:shadow-xl'
                    } ${expandedTaskId === task.id ? 'ring-2 ring-primary/10 border-primary/20' : ''}`}>
                    
                    <div className="flex items-center justify-between p-5 md:p-6 cursor-pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}>
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
                          className="transition-transform active:scale-90 hover:scale-110"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="text-accent-green" size={32} />
                          ) : (
                            <Circle className="text-border-strong group-hover:text-primary transition-colors" size={32} />
                          )}
                        </button>
                        <div>
                          <h3 className={`text-xl font-bold tracking-tight ${task.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-text-secondary font-medium mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                              task.pillar === 'wellness' ? 'bg-accent-green/10 text-accent-green' : 
                              task.pillar === 'mindset' ? 'bg-accent-blue/10 text-accent-blue' : 
                              'bg-accent-gold/10 text-accent-gold'
                            }`}>
                              {task.pillar}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{task.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-text-muted">
                        {expandedTaskId === task.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                    </div>

                    {expandedTaskId === task.id && (
                      <div className="px-6 pb-8 md:px-16 md:pb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="prose prose-primary max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap font-body border-t border-border pt-6">
                          {task.body.replace(/^# .+\n/, '')}
                        </div>
                        <div className="mt-8 flex justify-end">
                           {!task.completed && (
                             <button 
                               onClick={() => toggleTask(task.id)}
                               className="bg-accent-green text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-opacity-90 transition-all flex items-center gap-2"
                             >
                               Complete Task <CheckCircle2 size={18} />
                             </button>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {totalCount === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-bg-soft rounded-full flex items-center justify-center mx-auto text-text-muted">
                      <BookOpen size={32} />
                    </div>
                    <p className="text-text-muted text-lg italic">Rest and reflect. Your new plan starts tomorrow.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Stats & Quote */}
        <div className="space-y-8">
          <section className="bg-primary text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <Trophy className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-xl font-heading mb-8 relative z-10 opacity-80">Your Progress</h3>
            <div className="space-y-8 relative z-10">
              {stats?.pillars.map((p) => {
                const percent = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
                return (
                  <div key={p.pillar}>
                    <div className="flex justify-between text-sm mb-3 font-heading font-bold uppercase tracking-widest text-white/70">
                      <span>{p.pillar}</span>
                      <span className="text-lg">{percent}%</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
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
            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <span className="text-4xl font-heading block mb-1 uppercase tracking-tight">{user?.tier || 'Starter'}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Current Tier</span>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] border border-border shadow-lg relative">
             <div className="absolute top-6 left-6 text-primary/10">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M10 20H5V15H10V20ZM10 12H5V7H10V12ZM20 20H15V15H20V20ZM20 12H15V7H20V12Z" />
                </svg>
             </div>
            <p className="font-heading text-xl text-text-primary leading-relaxed relative z-10 mt-4">
              "Small steps, repeated daily, build unshakable foundations."
            </p>
            <cite className="not-italic block mt-6 text-[10px] font-black uppercase tracking-widest text-text-muted border-l-2 border-secondary pl-3">— Marcus Aurelius</cite>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
