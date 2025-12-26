'use client';

import type { Currency } from '@/stores/useCurrencyStore';
import { manrope } from '@/config/fonts';
import CurrencyCard from './currencyCard';

type CurrencyColumnProps = {
  title: string;
  currencies: Currency[];
  selectedCurrency: Currency | null;
  disabledCurrencyCode: string | null;
  onSelect: (currency: Currency) => void;
};

export default function CurrencyColumn({
  title,
  currencies,
  selectedCurrency,
  disabledCurrencyCode,
  onSelect,
}: CurrencyColumnProps) {
  return (
    <div className="flex h-full flex-col">
      <h3 className={`mb-4 text-3xl font-bold text-cyan-50  uppercase text-shadow-gray-600 text-shadow-sm ${manrope.className}`}>{title}</h3>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {currencies.length === 0
          ? (
              <div className="py-8 text-center text-gray-400">
                <p>No currencies found</p>
              </div>
            )
          : (
              currencies.map(currency => (
                <CurrencyCard
                  key={currency.id}
                  currency={currency}
                  isSelected={selectedCurrency?.code === currency.code}
                  isDisabled={disabledCurrencyCode === currency.code}
                  onClick={onSelect}
                />
              ))
            )}
      </div>
    </div>
  );
}
