'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import MyLink from '@/components/common/Link';

export default function Hero() {
  const t = useTranslations('Hero');

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.slice(1);
    const element = targetId ? document.getElementById(targetId) : null;

    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:-top-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#456F39] to-[#5B914A] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [30, 33, 30],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 lg:pb-24">
          <motion.div
            className="hidden sm:mb-8 sm:flex sm:justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2">
              <span className="text-sm text-green-400">{t('trusted_by_customers')}</span>
            </div>
          </motion.div>

          <div className="text-center">
            <motion.h1
              className="text-5xl font-semibold tracking-tight text-balance text-white uppercase sm:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {t('convert_money_with_ease')}
            </motion.h1>

            <motion.p
              className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {t('hero_description')}
            </motion.p>

            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <MyLink
                href="#converter"
                onClick={handleSmoothScroll}
                classNames="rounded-md border border-green-500/50 bg-green-500/15 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all hover:scale-105"
              >
                {t('button')}
              </MyLink>
              <MyLink
                href="#converter"
                opacity
                classNames="text-sm/6 font-semibold text-white transition-all hover:translate-x-1"
              >
                {t('try')}
                {' '}
                <span aria-hidden="true">→</span>
              </MyLink>
            </motion.div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#456F39] to-[#5B914A] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
