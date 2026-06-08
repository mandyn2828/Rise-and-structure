import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, CheckCircle2, Lock, ArrowRight, Star, Clock, BookOpen } from 'lucide-react';
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

  const handlePurchase = async (courseId, priceId) => {
    setPurchaseLoading(courseId);
    try {
      // Try real Stripe first
      try {
        const res = await axios.post(`${API_URL}/payments/create-checkout-session`, {
          courseId
        });
        if (res.data.url) {
          window.location.href = res.data.url;
          return;
        }
      } catch (stripeErr) {
        console.warn('Stripe checkout failed or unavailable, falling back to mock purchase');
      }

      // Fallback to mock purchase
      await axios.post(`${API_URL}/courses/${courseId}/mock-purchase`);
      await fetchCourses();
      alert('Course added to your account! (Development Mode)');
    } catch (err) {
      console.error('Purchase failed');
      alert('Failed to purchase course. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) return <div className="p-8 text-center font-body text-text-secondary text-xl">Loading courses...</div>;

  return (
    <div className="max-w-6xl mx-auto font-body">
      <header className="mb-12">
        <h1 className="text-4xl font-heading text-primary mb-3">Digital Store</h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Deep dives into health, finance, and mindset. Structured blueprints to accelerate your rebuild.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-bg-card border border-border rounded-[2rem] overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all group hover:-translate-y-1">
            <div className="h-48 bg-bg-soft relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-primary/10">
                  <ShoppingBag size={80} />
               </div>
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-border">
                  {course.difficulty}
               </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-2xl font-heading text-primary mb-3 leading-tight group-hover:text-secondary transition-colors">
                {course.title}
              </h2>
              
              <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>14-21 Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={16} />
                  <span>{course.slug === 'side-income-starter' ? '6' : course.slug === 'mental-discipline' ? '5' : '4'} Modules</span>
                </div>
              </div>

              <div className="prose prose-sm text-text-secondary mb-8 line-clamp-3">
                {course.description.split('## Course Description')[1]?.split('##')[0] || course.description}
              </div>

              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-3xl font-heading text-primary">${course.price_cents / 100}</span>
                </div>
                
                {course.is_owned ? (
                  <button 
                    className="flex items-center gap-2 text-accent-green font-bold bg-accent-green/10 px-4 py-2 rounded-xl"
                    disabled
                  >
                    Owned <CheckCircle2 size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchase(course.id)}
                    disabled={purchaseLoading === course.id}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {purchaseLoading === course.id ? 'Processing...' : 'Buy Course'} 
                    <ArrowRight size={18} />
                  </button>
                )
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-20 bg-primary text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <Star className="absolute -right-12 -top-12 text-white/5 w-64 h-64 rotate-12" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Want everything?</h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Get the full Rise & Structure course bundle and save over 25%. All blueprints, all modules, all lifetime access.
          </p>
          <button className="bg-secondary text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            Coming Soon: The Rebuild Bundle
          </button>
        </div>
      </section>
    </div>
  );
};

export default Store;
