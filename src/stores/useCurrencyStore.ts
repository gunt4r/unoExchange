import { create } from 'zustand';

export type Currency = {
  id: number;
  code: string;
  name: string;
  rateToUSD: number;
  imageUrl: string | null;
  reserve: number | null;
  isBase: boolean;
};

type CurrencyStore = {
  currencies: Currency[];
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrencies: (currencies: Currency[]) => void;
  setFromCurrency: (currency: Currency | null) => void;
  setToCurrency: (currency: Currency | null) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  swapCurrencies: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currencies: [],
  fromCurrency: null,
  toCurrency: null,
  fromAmount: '',
  toAmount: '',
  isLoading: false,
  error: null,

  setCurrencies: currencies => set({ currencies }),

  setFromCurrency: (currency) => {
    const { toCurrency } = get();
    // Если выбранная валюта совпадает с toCurrency, очищаем toCurrency
    if (currency && toCurrency && currency.code === toCurrency.code) {
      set({ fromCurrency: currency, toCurrency: null, toAmount: '' });
    } else {
      set({ fromCurrency: currency });
    }
  },

  setToCurrency: (currency) => {
    const { fromCurrency } = get();
    // Если выбранная валюта совпадает с fromCurrency, очищаем fromCurrency
    if (currency && fromCurrency && currency.code === fromCurrency.code) {
      set({ toCurrency: currency, fromCurrency: null, fromAmount: '' });
    } else {
      set({ toCurrency: currency });
    }
  },

  setFromAmount: amount => set({ fromAmount: amount }),
  setToAmount: amount => set({ toAmount: amount }),

  swapCurrencies: () => {
    const { fromCurrency, toCurrency, fromAmount, toAmount } = get();
    set({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
      fromAmount: toAmount,
      toAmount: fromAmount,
    });
  },

  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),

  reset: () => set({
    fromCurrency: null,
    toCurrency: null,
    fromAmount: '',
    toAmount: '',
    error: null,
  }),
}));
