'use client';

import type { Currency } from '@/stores/useCurrencyStore';
import { Button } from '@headlessui/react';
import Image from 'next/image';

type CurrencyCardProps = {
  currency: Currency;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (currency: Currency) => void;
};

export default function CurrencyCard({
  currency,
  isSelected,
  isDisabled,
  onClick,
}: CurrencyCardProps) {
  return (
    <Button
      onClick={() => !isDisabled && onClick(currency)}
      disabled={isDisabled}
      type="button"
      className={`
        group mb-0 w-full border-y border-white/10 p-0 text-left transition-all
        duration-200
        ${isSelected ? 'group-hover:opacity-80 focus-visible:opacity-80' : ''}
        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className={`
            pointer-events-none absolute inset-0 rounded-lg
            transition-opacity duration-500
            ${isSelected
      ? 'bg-linear-to-br from-[#111410] to-[#1f550f] opacity-100'
      : 'bg-[rgba(27,43,22,1)]/80 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
    }
          `}
        />

        <div className="relative z-10 flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {currency.imageUrl
              ? (
                  <Image
                    src={currency.imageUrl}
                    alt={currency.code}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                )
              : (
                  <span className="text-xl font-bold text-gray-400">
                    {currency.code.slice(0, 2)}
                  </span>
                )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold text-white">
              {currency.code}
            </div>

            <div className="text-sm text-gray-300">{currency.name}</div>

            {currency.reserve !== null && (
              <div className="mt-1 text-xs text-gray-400">
                Reserve:
                {' '}
                {currency.reserve.toLocaleString()}
              </div>
            )}
          </div>

          {/* Чекбокс / маркер */}
          <div
            className={`
              flex h-5 w-5 items-center justify-center rounded border-2
              transition-colors duration-300
              ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400 group-hover:border-white/70'}
            `}
          >
            {isSelected && (
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
}
