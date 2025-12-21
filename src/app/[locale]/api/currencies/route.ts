// src/app/api/currencies/route.ts
import { NextResponse } from 'next/server';
import { CurrencyService } from '@/services/currency';
import type { Currency } from '@/models/currency';
const currencyService = new CurrencyService();

// GET - получить активные валюты (для фронтенда)
export async function GET() {
  try {
    const currencies = await currencyService.getActiveCurrencies();
    
    // Возвращаем только нужные данные для фронта
    const publicCurrencies = currencies.map((currency: Currency) => ({
      id: currency.id,
      code: currency.code,
      name: currency.name,
      rateToZL: currency.rateToZL,
      imageUrl: currency.imageUrl,
      reserve: currency.reserve,
      isBase: currency.isBase
    }));

    return NextResponse.json(publicCurrencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении валют' },
      { status: 500 }
    );
  }
}