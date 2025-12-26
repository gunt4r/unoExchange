import { BarChart3, Clock, CreditCard, Globe, Lock, Users } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Support for 150+ currencies and 200+ countries worldwide',
    },
    {
      icon: Lock,
      title: 'Secure & Safe',
      description: 'Military-grade encryption and compliance with international standards',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Methods',
      description: 'Bank transfer, credit card, debit card, and digital wallets',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Rates',
      description: 'Access live exchange rates updated every second',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer service in multiple languages',
    },
    {
      icon: Users,
      title: 'Business Solutions',
      description: 'Dedicated tools for businesses and high-volume traders',
    },
  ];

  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="text-sm text-green-400">Why Choose Us</span>
          </div>
          <h2 className="mb-4 text-4xl text-white">Everything You Need</h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            Powerful features designed to make currency conversion simple, fast, and secure
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-green-400 to-green-600 transition-transform group-hover:scale-110">
                <feature.icon className="h-7 w-7 text-black" />
              </div>
              <h3 className="mb-3 text-xl text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
