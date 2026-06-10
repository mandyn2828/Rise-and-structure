import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';

const Plan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await axios.get(`${API_URL}/daily-plan`);
      setPlan(res.data);
    } catch (err) {
      console.error('Failed to fetch plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading your plan...</div>;

  return (
    <div className="max-w-4xl mx-auto font-body">
      <header className="mb-12">
        <h1 className="text-4xl font-heading text-primary mb-2">My Daily Plan</h1>
        <p className="text-text-secondary text-lg">
          Your structured roadmap for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
        </p>
      </header>

      <div className="space-y-8">
        {plan?.tasks?.map((task) => (
          <div key={task.id} className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                  task.pillar === 'wellness' ? 'bg-accent-green/10 text-accent-green' : 
                  task.pillar === 'mindset' ? 'bg-secondary/10 text-secondary' : 
                  'bg-accent-gold/10 text-accent-gold'
                }`}>
                  {task.pillar}
                </div>
                <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                  <Clock size={16} />
                  <span>5-15 min</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-text-primary mb-4">{task.title}</h2>
              <div className="prose prose-primary max-w-none text-text-secondary leading-relaxed mb-8">
                {task.body.replace(/^# .+\n/, '').split('\n\n')[0]}...
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  {task.completed ? (
                    <span className="flex items-center gap-2 text-accent-green font-bold">
                      <CheckCircle2 size={20} />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-text-muted font-bold">
                      <Circle size={20} />
                      Not started
                    </span>
                  )}
                </div>
                <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  View Full Lesson <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!plan?.tasks || plan.tasks.length === 0) && (
          <div className="bg-bg-soft rounded-[2rem] p-20 text-center border-2 border-dashed border-border">
            <BookOpen size={48} className="mx-auto text-text-muted mb-6" />
            <h3 className="text-2xl font-heading text-text-primary mb-2">Nothing scheduled yet</h3>
            <p className="text-text-secondary">Your personalized plan will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;
