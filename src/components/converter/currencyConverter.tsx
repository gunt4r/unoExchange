'use client';

import { easeOut, motion } from 'framer-motion';
import { Shield, TrendingUp, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCurrencies } from '@/queries/useCurrencies';
import { useCurrencyStore } from '@/stores/useCurrencyStore';
import Loader from '../common/loader';
import ConversionPanel from './conversionPanel';
import CurrencyColumn from './currencyColumn';

export default function CurrencyConverterSection() {
  const t = useTranslations('Converter');
  const [mounted, setMounted] = useState(false);
  const {
    currencies,
    fromCurrency,
    toCurrency,
    setCurrencies,
    setFromCurrency,
    setToCurrency,
  } = useCurrencyStore();
  const { data, isLoading } = useCurrencies();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      setCurrencies(data.data);
    }
  }, [data, isLoading, setCurrencies]);

  // Варианты анимации для заголовка
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: easeOut,
      },
    }),
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.6 + i * 0.1,
        ease: easeOut,
      },
    }),
  };

  if (isLoading) {
    return <Loader />;
  }

  const features = [
    {
      icon: Zap,
      title: t('fast_settlements'),
      description: t('fast_conversions'),
    },
    {
      icon: Shield,
      title: t('bank_security'),
      description: t('bank_description'),
    },
    {
      icon: TrendingUp,
      title: t('rates_title'),
      description: t('rates_description'),
    },
  ];

  return (
    <section id="converter" className="min-h-screen w-full bg-linear-to-br px-4 py-12 text-cyan-50">
      <div className="mx-auto max-w-7xl">
        {mounted
          ? (
              <motion.h1
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={titleVariants}
                className="mb-20 text-center text-4xl font-bold uppercase"
              >
                {t('title')}
              </motion.h1>
            )
          : (
              <h1 className="mb-20 text-center text-4xl font-bold uppercase">{t('title')}</h1>
            )}

        <div className="mb-10 grid h-[700px] grid-cols-1 gap-6 lg:grid-cols-3">
          {mounted
            ? (
                <>
                  <motion.div
                    custom={0}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
                  >
                    <CurrencyColumn
                      title="From currency"
                      currencies={currencies}
                      selectedCurrency={fromCurrency}
                      disabledCurrencyCode={toCurrency?.code || null}
                      onSelectAction={setFromCurrency}
                    />
                  </motion.div>

                  <motion.div
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
                  >
                    <CurrencyColumn
                      title="To currency"
                      currencies={currencies}
                      selectedCurrency={toCurrency}
                      disabledCurrencyCode={fromCurrency?.code || null}
                      onSelectAction={setToCurrency}
                    />
                  </motion.div>

                  <motion.div
                    custom={2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
                  >
                    <ConversionPanel />
                  </motion.div>
                </>
              )
            : (
                <>
                  <div className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10">
                    <CurrencyColumn
                      title="From currency"
                      currencies={currencies}
                      selectedCurrency={fromCurrency}
                      disabledCurrencyCode={toCurrency?.code || null}
                      onSelectAction={setFromCurrency}
                    />
                  </div>

                  <div className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10">
                    <CurrencyColumn
                      title="To currency"
                      currencies={currencies}
                      selectedCurrency={toCurrency}
                      disabledCurrencyCode={fromCurrency?.code || null}
                      onSelectAction={setToCurrency}
                    />
                  </div>

                  <div className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10">
                    <ConversionPanel />
                  </div>
                </>
              )}
        </div>

        {/* Анимированные фичи */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return mounted
              ? (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={featureVariants}
                    className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-900/30 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-400 to-green-600">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <div className="text-left">
                      <div className="text-white">{feature.title}</div>
                      <div className="text-sm text-gray-400">{feature.description}</div>
                    </div>
                  </motion.div>
                )
              : (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-900/30 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-400 to-green-600">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <div className="text-left">
                      <div className="text-white">{feature.title}</div>
                      <div className="text-sm text-gray-400">{feature.description}</div>
                    </div>
                  </div>
                );
          })}
        </div>
      </div>
    </section>
  );
}
