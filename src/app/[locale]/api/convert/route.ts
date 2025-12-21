// src/app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CurrencyService } from '@/services/currency';

const currencyService = new CurrencyService();

// POST - конвертировать валюты
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, amount } = body;

    if (!from || !to || !amount) {
      return NextResponse.json(
        { error: 'Не указаны обязательные параметры: from, to, amount' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Сумма должна быть больше 0' },
        { status: 400 }
      );
    }

    const result = await currencyService.convert(
      from.toUpperCase(),
      to.toUpperCase(),
      Number(amount)
    );

    return NextResponse.json({
      success: true,
      conversion: {
        from: {
          code: result.fromCurrency.code,
          name: result.fromCurrency.name,
          amount: result.fromAmount
        },
        to: {
          code: result.toCurrency.code,
          name: result.toCurrency.name,
          amount: result.toAmount
        },
        rate: result.rate,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Conversion error:', error);
    
    if (error.message === 'Валюта не найдена') {
      return NextResponse.json(
        { error: 'Одна из валют не найдена или неактивна' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при конвертации' },
      { status: 500 }
    );
  }
}