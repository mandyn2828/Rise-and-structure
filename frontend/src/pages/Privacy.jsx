import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 font-body">
      <h1 className="text-4xl font-heading text-primary mb-8">Privacy Policy</h1>
      <div className="prose prose-primary max-w-none text-text-secondary leading-relaxed space-y-8">
        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Introduction</h2>
          <p>Welcome to Rise & Structure. Your privacy is paramount to us. This policy outlines how we handle your data with transparency and care, ensuring you can focus on your daily rebuild with peace of mind.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Data Collection</h2>
          <p>We collect minimal information required to provide our service:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Your name and email address when you register.</li>
            <li><strong>Usage Data:</strong> We track which daily tasks you complete to help visualize your progress and maintain your streak.</li>
            <li><strong>Payment Information:</strong> Handled securely via Stripe; we do not store your credit card details on our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Cookies</h2>
          <p>We use essential cookies to keep you signed in and maintain your session. We may also use anonymous analytics cookies to understand how our members use the platform so we can improve the guidance system.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Third-Party Sharing</h2>
          <p>We do not sell your data. We only share information with trusted partners necessary to run the service:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Stripe:</strong> To process your subscription payments.</li>
            <li><strong>Hosting Providers:</strong> To keep the platform running securely.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. You can manage most of this through your dashboard settings or by contacting our support team.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Contact Us</h2>
          <p>If you have any questions about this policy, please reach out to us at <a href="mailto:support@riseandstructure.com" className="text-primary font-bold hover:underline">support@riseandstructure.com</a>.</p>
        </section>
        
        <p className="text-sm text-text-muted italic pt-8 border-t border-border">Last updated: June 7, 2026</p>
      </div>
    </div>
  );
};

export default Privacy;
