'use client';

import { easeOut, easeInOut, motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function About() {
  const t = useTranslations('AboutUs');

  const stats = [
    { value: 5, suffix: 'M+', prefix: '$', label: t('processed_annually') },
    { value: 500, suffix: 'K+', prefix: '', label: t('active_users') },
    { value: 4, suffix: '+', prefix: '', label: t('currencies') },
    { value: 200, suffix: 'K+', prefix: '', label: t('reserve') },
  ];

  const benefits = [
    t('no_hidden_fees'),
    t('transparent_pricing'),
    t('instant_transfer_notifications'),
    t('multi_currency'),
    t('api_access'),
    t('mobile_app'),
  ];

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: easeOut },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3, ease: easeOut },
    },
  };

  const statContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, delay: 0.5, ease: easeOut },
    },
  };

  const benefitVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: 0.6 + i * 0.05,
        ease: easeOut,
      },
    }),
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.7, delay: 0.6, ease: easeOut },
    },
  };

  return (
    <section id="about" className="relative py-20">
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: easeInOut,
          }}
          className="absolute top-1/2 left-0 h-96 w-96 max-w-full rounded-full bg-green-500/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: easeInOut,
            delay: 1,
          }}
          className="absolute right-0 bottom-0 h-96 w-26 sm:w-96 max-w-full rounded-full bg-green-600/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={badgeVariants}
            className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2"
          >
            <span className="text-sm text-green-400">{t('badge')}</span>
          </motion.div>
          <motion.h2
            variants={titleVariants}
            className="mb-4 text-4xl text-white"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            variants={descriptionVariants}
            className="mx-auto max-w-2xl text-gray-300"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4"
          variants={statContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => (
            <AnimatedStat key={index} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Контент с анимацией */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={contentVariants}
          >
            <Image className="relative max-w-3/5 justify-self-center w-full mb-16 rounded-2xl border border-green-500/20"  src="/assets/images/unoexchange.svg" alt="logo" width={100} height={100} />
            <h3 className="mb-6 text-3xl text-white">{t('why_different')}</h3>
            <p className="mb-8 text-gray-300">{t('why_different_description')}</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={benefitVariants}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
            className="relative"
          >
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-400 to-green-600 opacity-20 blur-2xl" />
            <Image
              src="/assets/images/office-image.jpg"
              alt="Team"
              className="relative h-auto w-full rounded-2xl border border-green-500/20 object-cover"
              width={1080}
              height={1080}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({
  stat,
  index,
}: {
  stat: { value: number; suffix: string; prefix: string; label: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
    margin: '0px 0px -100px 0px',
  });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const timer = setTimeout(() => {
      motionValue.set(stat.value);
    }, 100);

    return () => clearTimeout(timer);
  }, [isInView, stat.value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={isInView
          ? {
              opacity: 1,
              scale: 1,
              y: 0,
            }
          : {
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: easeOut,
        }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        className="rounded-xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-6 text-center"
      >
        <div className="mb-2 text-3xl text-green-400">
          {stat.prefix}
          {displayValue}
          {stat.suffix}
        </div>
        <div className="text-sm text-gray-400">{stat.label}</div>
      </motion.div>
    </div>
  );
}
