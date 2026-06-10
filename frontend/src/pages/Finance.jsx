import { DollarSign, TrendingUp, ShieldCheck, Briefcase, PieChart } from 'lucide-react';

const Finance = () => {
  const principles = [
    {
      title: 'Income Multiplication',
      icon: Briefcase,
      color: 'text-accent-gold',
      description: 'Negotiating salary and building secondary income streams through high-value skills.'
    },
    {
      title: 'Wealth Preservation',
      icon: ShieldCheck,
      color: 'text-accent-green',
      description: 'Mastering the basics of management, tax efficiency, and expense structuralization.'
    },
    {
      title: 'Strategic Investing',
      icon: TrendingUp,
      color: 'text-primary',
      description: 'Simple, long-term wealth building that works for mid-lifers, not just day traders.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto font-body">
      <header className="mb-16 text-center md:text-left">
        <div className="w-16 h-16 bg-accent-gold/10 text-accent-gold rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
          <DollarSign size={32} />
        </div>
        <h1 className="text-5xl md:text-6xl font-heading text-primary mb-6">Finance Pillar</h1>
        <p className="text-text-secondary text-xl max-w-3xl leading-relaxed">
          Financial freedom isn't about complexity; it's about structure. We provide the micro-lessons and blueprints to help you earn more, keep more, and invest smarter.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {principles.map((p) => (
          <div key={p.title} className="bg-bg-soft/50 p-10 rounded-[2.5rem] border border-border transition-all hover:bg-white hover:shadow-2xl group">
            <div className={`w-12 h-12 bg-white ${p.color} rounded-xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
              <p.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{p.title}</h3>
            <p className="text-text-secondary leading-relaxed font-medium opacity-80">
              {p.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-text-primary text-white rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-primary/20 opacity-50"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-heading mb-8">Building your <span className="italic text-accent-gold">Wealth Foundation</span></h2>
            <p className="text-lg text-bg-soft/70 mb-10 leading-relaxed">
              Most financial advice is designed for 20-year-olds with infinite time. Our systems are built for the mid-life professional who needs results now and a secure structure for the future.
            </p>
            <button className="bg-white text-primary px-10 py-4 rounded-2xl font-bold hover:bg-bg-soft transition-all active:scale-95 shadow-lg">
              Explore Finance Blueprints
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center text-primary">
                <PieChart size={20} />
              </div>
              <h3 className="text-xl font-bold">The Golden Ratio</h3>
            </div>
            <div className="space-y-8">
              {[
                { label: 'Living Expenses', value: '50%', color: 'bg-white/20' },
                { label: 'Future Rebuild', value: '30%', color: 'bg-accent-gold' },
                { label: 'Current Enjoyment', value: '20%', color: 'bg-white/40' }
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-3 font-bold uppercase tracking-widest opacity-60">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.value }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
