import { Activity, Heart, Zap, Apple, Moon } from 'lucide-react';

const Wellness = () => {
  const sections = [
    {
      title: 'Physical Foundation',
      icon: Activity,
      color: 'text-accent-green',
      bg: 'bg-accent-green/10',
      description: 'Daily mobility, functional strength, and active recovery designed for the mid-life body.'
    },
    {
      title: 'Nutritional Clarity',
      icon: Apple,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      description: 'Simple, effective fueling strategies. No complicated meal plans, just consistent habits.'
    },
    {
      title: 'Recovery & Sleep',
      icon: Moon,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      description: 'Optimizing your rest cycle to ensure maximum energy for your daily rebuild.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto font-body">
      <header className="mb-16">
        <div className="w-16 h-16 bg-accent-green/10 text-accent-green rounded-2xl flex items-center justify-center mb-8">
          <Heart size={32} />
        </div>
        <h1 className="text-5xl font-heading text-primary mb-6">Wellness Pillar</h1>
        <p className="text-text-secondary text-xl max-w-2xl leading-relaxed">
          The foundation of your second act is your health. We focus on the minimum effective dose of movement and nutrition to keep you performing at your peak.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {sections.map((section) => (
          <div key={section.title} className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl transition-all">
            <div className={`w-12 h-12 ${section.bg} ${section.color} rounded-xl flex items-center justify-center mb-8`}>
              <section.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{section.title}</h3>
            <p className="text-text-secondary leading-relaxed font-medium opacity-80">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      <section className="bg-bg-soft rounded-[3rem] p-12 border border-border">
        <h2 className="text-3xl font-heading text-primary mb-8">Wellness Daily Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Zap size={20} className="text-accent-gold" />
              Core Principles
            </h3>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-2.5"></div>
                <span>Mobility over intensity. Consistency over volume.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-2.5"></div>
                <span>Focus on protein-first, whole-food nutrition.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-2.5"></div>
                <span>Prioritize 7-8 hours of high-quality sleep.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-border flex items-center justify-center text-center">
            <div>
              <p className="text-text-muted font-black uppercase tracking-widest text-[10px] mb-4">Today's Metric</p>
              <div className="text-5xl font-heading text-primary mb-2">10</div>
              <p className="text-text-secondary font-bold">Minutes of mobility</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wellness;
