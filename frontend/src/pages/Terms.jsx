import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 font-body">
      <h1 className="text-4xl font-heading text-primary mb-8">Terms of Service</h1>
      <div className="prose prose-primary max-w-none text-text-secondary leading-relaxed space-y-8">
        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Agreement to Terms</h2>
          <p>By using Rise & Structure, you agree to these terms. Our goal is to provide a structured, supportive environment for your personal growth.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Subscription & Billing</h2>
          <p>We offer monthly and annual subscription tiers. Billing is processed at the start of your subscription period. Your subscription will automatically renew unless cancelled.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Cancellation & Refunds</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cancellation:</strong> You can cancel your subscription at any time through your account dashboard. You will continue to have access until the end of your current billing period.</li>
            <li><strong>Refunds:</strong> We offer a 7-day refund policy for annual plans if you find the platform is not a fit for you. Monthly plans are generally non-refundable but can be cancelled at any time to prevent future charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Limitation of Liability</h2>
          <p>Rise & Structure provides guidance and tools for personal development. While we strive for accuracy and effectiveness, the platform is used at your own risk. We are not responsible for financial, health, or personal outcomes resulting from the use of our content.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Governing Law</h2>
          <p>These terms are governed by the laws of the state of New York, without regard to its conflict of law provisions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-heading text-text-primary mb-4">Changes to Terms</h2>
          <p>We may update these terms from time to time. We will notify you of any significant changes via the email address associated with your account.</p>
        </section>

        <p className="text-sm text-text-muted italic pt-8 border-t border-border">Last updated: June 7, 2026</p>
      </div>
    </div>
  );
};

export default Terms;
