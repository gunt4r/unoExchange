'use client';

import { easeOut, motion } from 'framer-motion';
import { BarChart3, Clock, CreditCard, Globe, Lock, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function Features() {
  const t = useTranslations('Features');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
        delay: 0.2,
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
        delay: 0.3,
        ease: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.5 + i * 0.1,
        ease: easeOut,
      },
    }),
  };

  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          {mounted
            ? (
                <>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={badgeVariants}
                    className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2"
                  >
                    <span className="text-sm text-green-400">{t('badge')}</span>
                  </motion.div>
                  <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={titleVariants}
                    className="mb-4 text-4xl text-white"
                  >
                    {t('title')}
                  </motion.h2>
                  <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={descriptionVariants}
                    className="mx-auto max-w-2xl text-gray-300"
                  >
                    {t('description')}
                  </motion.p>
                </>
              )
            : (
                <>
                  <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
                    <span className="text-sm text-green-400">{t('badge')}</span>
                  </div>
                  <h2 className="mb-4 text-4xl text-white">{t('title')}</h2>
                  <p className="mx-auto max-w-2xl text-gray-300">
                    {t('description')}
                  </p>
                </>
              )}
        </div>

        {/* Анимированные карточки */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return mounted
              ? (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className="group rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-green-400 to-green-600"
                    >
                      <Icon className="h-7 w-7 text-black" />
                    </motion.div>
                    <h3 className="mb-3 text-xl text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                )
              : (
                  <div
                    key={index}
                    className="group rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-green-400 to-green-600 transition-transform group-hover:scale-110">
                      <Icon className="h-7 w-7 text-black" />
                    </div>
                    <h3 className="mb-3 text-xl text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                );
          })}
        </div>
      </div>
    </section>
  );
}
