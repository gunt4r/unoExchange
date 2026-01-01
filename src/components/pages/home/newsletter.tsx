'use client';
import { Button, Input } from '@headlessui/react';
import { easeInOut, easeOut, motion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePostNewsletter } from '@/queries/useNewsletter';

export function Newsletter() {
  const t = useTranslations('Newsletter');
  const tEmail = useTranslations('Email');
  const tCommon = useTranslations('Common');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mutate: postNewsletter } = usePostNewsletter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      postNewsletter(
        { email },
        {
          onSuccess: () => {
            toast.success(t('thanks'));
          },
          onError: () => {
            toast.error(tCommon('something_went_wrong'));
          },
        },
      );
      setEmail('');
      setSubscribed(true);
    }
  };

  // Анимация контейнера
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: easeOut,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: easeOut,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: easeOut,
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.5,
        ease: easeOut,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: easeOut,
      },
    },
  };

  return (
    <section className="relative py-20">
      <div className="absolute inset-0">
        {mounted && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.1, 0.25, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: easeInOut,
              }}
              className="absolute top-10 left-10 h-72 w-14 rounded-full bg-green-400/20 blur-3xl sm:w-72"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.1, 0.25, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: easeInOut,
                delay: 1,
              }}
              className="absolute right-10 bottom-10 h-72 w-14 rounded-full bg-green-600/20 blur-3xl sm:w-72"
            />
          </>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {mounted
          ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="rounded-3xl border border-green-500/20 bg-linear-to-br from-gray-900/80 to-black/80 p-12 shadow-2xl backdrop-blur-sm"
              >
                <div className="mb-8 text-center">
                  <motion.div
                    variants={iconVariants}
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-400 to-green-600"
                  >
                    <Mail className="h-8 w-8 text-black" />
                  </motion.div>
                  <motion.h2 variants={titleVariants} className="mb-4 text-4xl text-white">
                    {t('badge')}
                  </motion.h2>
                  <motion.p
                    variants={descriptionVariants}
                    className="mx-auto max-w-2xl text-gray-300"
                  >
                    {t('description')}
                  </motion.p>
                </div>

                <motion.form
                  variants={formVariants}
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="relative flex-1"
                    >
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={tEmail('enter')}
                        className="w-full rounded-xl border border-green-500/20 bg-black/50 px-6 py-4 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                        required
                        disabled={subscribed}
                      />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={subscribed}
                        className={`flex cursor-pointer justify-self-center rounded-xl px-8 py-4 shadow-lg transition-all ${
                          subscribed
                            ? 'bg-green-600 text-white'
                            : 'bg-linear-to-r from-green-600 to-green-500 text-white shadow-green-500/30 hover:opacity-70'
                        }`}
                      >
                        {subscribed
                          ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-5 w-5" />
                                {tEmail('subscribed')}
                              </motion.span>
                            )
                          : (
                              tEmail('subscribe')
                            )}
                      </Button>
                    </motion.div>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">{t('unsubscribe')}</p>
                </motion.form>
              </motion.div>
            )
          : (
              <div className="rounded-3xl border border-green-500/20 bg-linear-to-br from-gray-900/80 to-black/80 p-12 shadow-2xl backdrop-blur-sm">
                <div className="mb-8 text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-400 to-green-600">
                    <Mail className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="mb-4 text-4xl text-white">{t('badge')}</h2>
                  <p className="mx-auto max-w-2xl text-gray-300">{t('description')}</p>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto max-w-md">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={tEmail('enter')}
                        className="w-full rounded-xl border border-green-500/20 bg-black/50 px-6 py-4 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                        required
                        disabled={subscribed}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={subscribed}
                      className={`flex cursor-pointer justify-self-center rounded-xl px-8 py-4 shadow-lg transition-all ${
                        subscribed
                          ? 'bg-green-600 text-white'
                          : 'bg-linear-to-r from-green-600 to-green-500 text-white shadow-green-500/30 hover:opacity-70'
                      }`}
                    >
                      {subscribed
                        ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              {tEmail('subscribed')}
                            </span>
                          )
                        : (
                            tEmail('subscribe')
                          )}
                    </Button>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">{t('unsubscribe')}</p>
                </form>
              </div>
            )}
      </div>
    </section>
  );
}
