import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 font-body">
      <h1 className="text-4xl font-heading text-primary mb-8">Support</h1>
      <p className="text-xl text-text-secondary mb-12">Need help with your rebuild? Our team is here to support you.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
          <Mail className="text-primary mb-4" size={32} />
          <h2 className="text-2xl font-heading mb-4">Email Us</h2>
          <p className="text-text-secondary mb-6">For account issues, billing, or general inquiries.</p>
          <a href="mailto:support@riseandstructure.com" className="text-primary font-bold hover:underline">support@riseandstructure.com</a>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
          <MessageCircle className="text-secondary mb-4" size={32} />
          <h2 className="text-2xl font-heading mb-4">Community</h2>
          <p className="text-text-secondary mb-6">Join our community forum to ask questions and share progress.</p>
          <button className="text-secondary font-bold hover:underline">Go to Forum</button>
        </div>
      </div>
    </div>
  );
};

export default Support;
