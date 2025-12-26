import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export function About() {
  const stats = [
    { value: '$50B+', label: 'Processed Annually' },
    { value: '500K+', label: 'Active Users' },
    { value: '150+', label: 'Currencies' },
    { value: '200+', label: 'Countries' },
  ];

  const benefits = [
    'No hidden fees or charges',
    'Transparent pricing structure',
    'Instant transfer notifications',
    'Multi-currency accounts',
    'API access for developers',
    'Mobile app available',
  ];

  return (
    <section id="about" className="relative  py-20">
      <div className="absolute inset-0 ">
        <div className="absolute top-1/2 left-0 h-96 w-96 max-w-full rounded-full bg-green-500/10 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 max-w-full rounded-full bg-green-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="text-sm text-green-400">About Us</span>
          </div>
          <h2 className="mb-4 text-4xl text-white">Trusted by Millions Worldwide</h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            We've been revolutionizing money conversion since 2015, helping individuals and businesses move money across borders seamlessly.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-6 text-center"
            >
              <div className="mb-2 text-3xl text-green-400">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h3 className="mb-6 text-3xl text-white">Why We're Different</h3>
            <p className="mb-8 text-gray-300">
              We combine cutting-edge technology with customer-first service to deliver the best money conversion experience. Our platform is built on trust, transparency, and innovation.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-400 to-green-600 opacity-20 blur-2xl"></div>
            <Image
              src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzY2MzEwNjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Team"
              className="relative h-auto w-full rounded-2xl border border-green-500/20 object-cover"
              width={1080}
              height={1080}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
