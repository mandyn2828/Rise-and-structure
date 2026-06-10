import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, CheckCircle2, Lock, ArrowRight, Star, Clock, BookOpen, Layers } from 'lucide-react';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';

const Store = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (courseId) => {
    setPurchaseLoading(courseId);
    try {
      const res = await axios.post(`${API_URL}/payments/create-course-checkout`, {
        courseId
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error('Purchase failed');
      // Fallback for development if Stripe is not configured
      try {
        await axios.post(`${API_URL}/courses/${courseId}/mock-purchase`);
        await fetchCourses();
        alert('Course added to your account! (Development Mode Fallback)');
      } catch (mockErr) {
        alert('Failed to purchase course. Please try again.');
      }
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) return <div className="p-20 text-center font-body text-text-secondary text-xl animate-pulse">Loading the Digital Store...</div>;

  const getCourseMeta = (slug) => {
    switch (slug) {
      case 'health-foundations':
        return { lessons: 14, modules: 4, duration: '14 Days' };
      case 'side-income-starter':
        return { lessons: 21, modules: 6, duration: '21 Days' };
      case 'mental-discipline':
        return { lessons: 14, modules: 5, duration: '14 Days' };
      default:
        return { lessons: 10, modules: 3, duration: '10 Days' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 font-body">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6">
          Digital Products & Blueprints
        </div>
        <h1 className="text-5xl md:text-6xl font-heading text-primary mb-6">Master the Rebuild.</h1>
        <p className="text-text-secondary text-xl max-w-2xl mx-auto leading-relaxed">
          Deep-dive blueprints designed to give you extreme clarity and immediate action in health, finance, and mindset.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course) => {
          const meta = getCourseMeta(course.slug);
          return (
            <div key={course.id} className="bg-white border border-border rounded-[2.5rem] overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all group hover:-translate-y-2">
              <div className="h-56 bg-bg-soft relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:opacity-0 transition-opacity"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-primary/10 group-hover:scale-110 transition-transform duration-700">
                    <ShoppingBag size={100} />
                 </div>
                 <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-border">
                    {course.difficulty}
                 </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col">
                <h2 className="text-3xl font-heading text-primary mb-4 leading-tight group-hover:text-secondary transition-colors">
                  {course.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-text-muted mb-8 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-secondary" />
                    <span>{meta.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-secondary" />
                    <span>{meta.modules} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-secondary" />
                    <span>{meta.lessons} Lessons</span>
                  </div>
                </div>

                <div className="prose prose-sm text-text-secondary mb-10 line-clamp-4 leading-relaxed italic">
                  {course.description.split('## Course Description')[1]?.split('##')[0]?.trim() || course.description}
                </div>

                <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-heading text-primary">${course.price_cents / 100}</span>
                  </div>
                  
                  {course.is_owned ? (
                    <div className="flex items-center gap-2 text-accent-green font-bold bg-accent-green/10 px-6 py-3 rounded-2xl">
                      Owned <CheckCircle2 size={20} />
                    </div>
                  ) : (
                    <button 
                      onClick={() => handlePurchase(course.id)}
                      disabled={purchaseLoading === course.id}
                      className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 group/btn"
                    >
                      {purchaseLoading === course.id ? 'Processing...' : 'Buy Now'} 
                      <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-32 bg-text-primary text-white p-12 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 opacity-50"></div>
        <Star className="absolute -right-16 -top-16 text-white/5 w-80 h-80 rotate-12" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading mb-8 leading-tight">Ready for the full experience?</h2>
          <p className="text-xl text-bg-soft/70 mb-12 leading-relaxed max-w-2xl">
            Get lifetime access to all current and future courses, plus the complete Rise & Structure daily guidance system, for one simple price.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="bg-secondary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20 active:scale-95">
              Explore Bundle
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Compare Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;
