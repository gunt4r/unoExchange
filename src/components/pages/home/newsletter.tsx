'use client';
import { Button, Input } from '@headlessui/react';
import { CheckCircle2, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePostNewsletter } from '@/queries/useNewsletter';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { mutate: postNewsletter } = usePostNewsletter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      postNewsletter({ email }, {
        onSuccess: () => {
          toast.success('Thanks for subscribing!');
        },
        onError: () => {
          toast.error('Something went wrong, please try again.');
        },
      });
      setEmail('');
      setSubscribed(true);
    }
  };

  return (
    <section className="relative  py-20">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 h-72 w-72 animate-pulse rounded-full bg-green-400/20 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-72 w-72 animate-pulse rounded-full bg-green-600/20 blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-green-500/20 bg-linear-to-br from-gray-900/80 to-black/80 p-12 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-400 to-green-600">
              <Mail className="h-8 w-8 text-black" />
            </div>
            <h2 className="mb-4 text-4xl text-white">Stay Updated</h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              Subscribe to our newsletter and get the latest exchange rates, market insights, and exclusive offers delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-green-500/20 bg-black/50 px-6 py-4 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                  required
                  disabled={subscribed}
                />
              </div>
              <Button
                type="submit"
                disabled={subscribed}
                className={`cursor-pointer rounded-xl px-8 py-4 shadow-lg transition-all ${
                  subscribed
                    ? 'bg-green-600 text-white'
                    : 'bg-linear-to-r from-green-600 to-green-500 text-white shadow-green-500/30 hover:opacity-70'
                }`}
              >
                {subscribed
                  ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Subscribed!
                      </span>
                    )
                  : (
                      'Subscribe'
                    )}
              </Button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
