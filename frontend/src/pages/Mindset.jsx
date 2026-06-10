import { Brain, Compass, Target, MessageSquare, Sparkles } from 'lucide-react';

const Mindset = () => {
  const focuses = [
    {
      title: 'Identity Shift',
      icon: Target,
      description: 'Moving from the "burnt-out professional" to the "intentional architect" of your own life.'
    },
    {
      title: 'Clarity & Purpose',
      icon: Compass,
      description: 'Defining what success looks like in your next act, beyond just the balance sheet.'
    },
    {
      title: 'Resilience Training',
      icon: Sparkles,
      description: 'Building the mental discipline to stay consistent when motivation inevitably fades.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto font-body">
      <header className="mb-16">
        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8">
          <Brain size={32} />
        </div>
        <h1 className="text-5xl font-heading text-primary mb-6">Mindset Pillar</h1>
        <p className="text-text-secondary text-xl max-w-2xl leading-relaxed">
          The internal structure is as important as the external. We provide the daily prompts and mindset frameworks to help you find direction and maintain absolute consistency.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        {focuses.map((f) => (
          <div key={f.title} className="flex flex-col">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
              <f.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{f.title}</h3>
            <p className="text-text-secondary leading-relaxed font-medium">
              {f.description}
            </p>
          </div>
        ))}
      </div>

      <section className="bg-primary text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" />
           </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-heading mb-8">The <span className="italic text-secondary">Quiet Confidence</span> of Structure</h2>
          <p className="text-xl opacity-80 mb-12 leading-relaxed">
            Most mid-life crises are simply a lack of structure. When you know exactly what to do each morning, the anxiety of "what's next" disappears.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="flex gap-4 items-start">
              <MessageSquare className="text-secondary flex-shrink-0" />
              <p className="text-lg italic font-heading">
                "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult."
              </p>
            </div>
            <cite className="block mt-4 text-xs font-black uppercase tracking-widest opacity-40 not-italic">— Seneca</cite>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mindset;
