import { User, Bell, Shield, CreditCard, LogOut, ChevronRight, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { subscribeToPush, checkPushSubscription } from '../utils/push';
import axios from 'axios';
import { API_URL } from '../api/config';
import { useState, useEffect } from 'react';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    checkPushSubscription().then(setIsSubscribed);
  }, []);

  const handlePushToggle = async () => {
    setPushLoading(true);
    const success = await subscribeToPush();
    setIsSubscribed(success);
    setPushLoading(false);
    if (success) {
      alert('Push notifications enabled!');
    }
  };

  const handlePushTest = async () => {
    try {
      await axios.post(`${API_URL}/notifications/test`);
    } catch (err) {
      alert('Test failed. Make sure you enabled notifications.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    {
      title: 'Account Information',
      icon: User,
      items: [
        { label: 'Full Name', value: user?.full_name },
        { label: 'Email Address', value: user?.email }
      ]
    },
    {
      title: 'Subscription',
      icon: CreditCard,
      items: [
        { label: 'Current Plan', value: user?.tier?.toUpperCase() || 'Starter' },
        { label: 'Status', value: user?.subscription_status || 'Active' },
        { label: 'Trial Ends', value: user?.trial_ends_at ? new Date(user.trial_ends_at).toLocaleDateString() : 'N/A' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      custom: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-text-muted mb-1">Push Notifications</p>
              <p className="text-lg font-bold text-text-primary">{isSubscribed ? 'Enabled' : 'Disabled'}</p>
            </div>
            <button 
              onClick={handlePushToggle}
              disabled={pushLoading}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${isSubscribed ? 'bg-bg-soft text-text-secondary' : 'bg-primary text-white shadow-lg'}`}
            >
              {pushLoading ? '...' : isSubscribed ? 'Disable' : 'Enable'}
            </button>
          </div>
          {isSubscribed && (
            <button 
              onClick={handlePushTest}
              className="w-full bg-secondary/10 text-secondary py-3 rounded-xl font-bold hover:bg-secondary/20 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Smartphone size={18} />
              Send Test Notification
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto font-body">
      <header className="mb-12">
        <h1 className="text-4xl font-heading text-primary mb-2">Settings</h1>
        <p className="text-text-secondary text-lg">Manage your account and preferences.</p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-border bg-bg-soft/30 flex items-center gap-3">
              <section.icon size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-text-primary uppercase tracking-widest text-xs">{section.title}</h2>
            </div>
            <div className="p-8 space-y-6">
              {section.custom ? section.custom : section.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-text-muted mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-text-primary">{item.value}</p>
                  </div>
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-6 text-error-rust bg-red-50 hover:bg-red-100 rounded-2xl transition-all font-bold"
          >
            <LogOut size={24} />
            Sign Out of Rise & Structure
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
