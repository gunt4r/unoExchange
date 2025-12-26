/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import { Button, Input } from '@headlessui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { manrope } from '@/config/fonts';
import { usePostConvert } from '@/queries/useConvert';
import { useCurrencyStore } from '@/stores/useCurrencyStore';

export default function ConversionPanel() {
  const { mutateAsync: convert, isPending } = usePostConvert();
  const {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    setFromAmount,
    setToAmount,
    swapCurrencies,
    isLoading,
    error,
    setLoading,
    setError,
  } = useCurrencyStore();

  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setToAmount('');
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setConversionRate(null);
      return;
    }

    const convertCurrency = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await convert({
          from: fromCurrency.code,
          to: toCurrency.code,
          amount: Number.parseFloat(fromAmount),
        });

        setToAmount(data.conversion.to.amount.toString());
        setConversionRate(data.conversion.rate);
        setLastUpdateTime(new Date(data.conversion.timestamp).toLocaleTimeString());
      } catch (err: any) {
        setError(err.message);
        setToAmount('');
        setConversionRate(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(convertCurrency, 500);
    return () => clearTimeout(debounceTimer);
  }, [fromAmount, fromCurrency, toCurrency, setError, setLoading, setToAmount, convert]);

  const handleSwap = () => {
    if (fromCurrency && toCurrency) {
      swapCurrencies();
    }
  };

  const hasBothCurrencies = fromCurrency && toCurrency;

  return (
    <div className="flex h-full flex-col">
      <h3 className={`mb-4 text-3xl font-bold  text-zinc-50 uppercase ${manrope.className}`}>Converter</h3>
      {!hasBothCurrencies
        ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="px-8 text-center text-zinc-500">
                <svg className="mx-auto mb-4 h-16 w-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="text-sm">Please select a currency to convert from and to</p>
              </div>
            </div>
          )
        : (
            <div className="animate-in fade-in flex-1 space-y-4 duration-300">
              <div className="rounded-lg border-2 border-gray-200 bg-white/10 p-4 backdrop-blur-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {fromCurrency.imageUrl
                      ? (
                          <Image
                            src={fromCurrency.imageUrl}
                            alt={fromCurrency.code}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        )
                      : (
                          <span className="text-lg font-bold text-zinc-500">
                            {fromCurrency.code.slice(0, 2)}
                          </span>
                        )}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">{fromCurrency.code}</div>
                    <div className="text-xs text-zinc-300">{fromCurrency.name}</div>
                  </div>
                </div>

                <Input
                  type="number"
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full border-0 bg-transparent text-2xl font-semibold text-zinc-200 outline-none"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleSwap}
                  className="cursor-pointer rounded-full bg-[#5B914A] p-3 text-white shadow-lg transition-all duration-200 hover:bg-[#406833] hover:shadow-xl active:scale-95"
                  title="Swap currencies"
                  type="button"
                >
                  {isLoading && isPending
                    ? <BeatLoader size={7} color="#fff" />
                    : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      )}
                </Button>
              </div>

              <div className="rounded-lg border-2 border-gray-200 bg-white/10 p-4 backdrop-blur-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {toCurrency.imageUrl
                      ? (
                          <Image
                            src={toCurrency.imageUrl}
                            alt={toCurrency.code}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        )
                      : (
                          <span className="text-lg font-bold text-zinc-500">
                            {toCurrency.code.slice(0, 2)}
                          </span>
                        )}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">{toCurrency.code}</div>
                    <div className="text-xs text-zinc-300">{toCurrency.name}</div>
                  </div>
                </div>

                <div className="text-2xl font-semibold text-zinc-200">
                  {isLoading
                    ? (
                        <span className="text-zinc-500">Loading...</span>
                      )
                    : toAmount
                      ? (
                          Number.parseFloat(toAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        )
                      : (
                          <span className="text-zinc-500">0.00</span>
                        )}
                </div>
              </div>

              {conversionRate && (
                <div className="animate-in fade-in rounded-lg border-2 border-gray-200 bg-white/10 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-gray-100">
                    <span>Курс обмена:</span>
                    <span className="font-semibold">
                      1
                      {' '}
                      {fromCurrency.code}
                      {' '}
                      =
                      {' '}
                      {conversionRate.toFixed(6)}
                      {' '}
                      {toCurrency.code}
                    </span>
                  </div>
                  {lastUpdateTime && (
                    <div className="mt-1 text-xs text-zinc-400">
                      Updated:
                      {' '}
                      {lastUpdateTime}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="animate-in fade-in rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 duration-200">
                  {error}
                </div>
              )}
            </div>
          )}
    </div>
  );
}
