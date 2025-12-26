'use client';

import { Shield, TrendingUp, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useCurrencies } from '@/queries/useCurrencies';
import { useCurrencyStore } from '@/stores/useCurrencyStore';
import Loader from '../common/loader';
import ConversionPanel from './conversionPanel';
import CurrencyColumn from './currencyColumn';

export default function CurrencyConverterSection() {
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
    if (data && !isLoading) {
      setCurrencies(data.data);
    }
  }, [data, isLoading, setCurrencies]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section id="converter" className="min-h-screen w-full bg-linear-to-br px-4 py-12 text-cyan-50">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-20 text-center text-4xl font-bold uppercase">Currency converter</h1>
        <div className="mb-10 grid h-[700px] grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10">
            <CurrencyColumn
              title="From currency"
              currencies={currencies}
              selectedCurrency={fromCurrency}
              disabledCurrencyCode={toCurrency?.code || null}
              onSelect={setFromCurrency}
            />
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10">
            <CurrencyColumn
              title="To currency"
              currencies={currencies}
              selectedCurrency={toCurrency}
              disabledCurrencyCode={fromCurrency?.code || null}
              onSelect={setToCurrency}
            />
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8 shadow-lg transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10">
            <ConversionPanel />
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-900/30 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-400 to-green-600">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <div className="text-left">
              <div className="text-white">Fast settlements</div>
              <div className="text-sm text-gray-400">Most conversions are completed within minutes, not days.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-900/30 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-400 to-green-600">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <div className="text-left">
              <div className="text-white">Bank-Level Security</div>
              <div className="text-sm text-gray-400">Industry-standard encryption and compliance with global financial regulations.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-900/30 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-400 to-green-600">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
            <div className="text-left">
              <div className="text-white">Best Rates</div>
              <div className="text-sm text-gray-400">Real-time updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
