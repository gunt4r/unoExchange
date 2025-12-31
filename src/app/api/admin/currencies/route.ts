import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CurrencyService } from '@/services/currency';

const currencyService = new CurrencyService();

export async function GET() {
  try {
    const currencies = await currencyService.getAllCurrencies();
    return NextResponse.json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении валют' },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { code, name, rateToZL, imageUrl, reserve, isBase } = body;

    if (!code || !name || (!rateToZL && !isBase)) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 },
      );
    }

    const currency = await currencyService.createCurrency({
      code: code.toUpperCase(),
      name,
      rateToZL: Number(rateToZL) || 1,
      imageUrl,
      reserve: reserve ? Number(reserve) : undefined,
      isBase: isBase || false,
    });

    return NextResponse.json(currency, { status: 201 });
  } catch (error: any) {
    console.error('Error creating currency:', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Валюта с таким кодом уже существует' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при создании валюты' },
      { status: 500 },
    );
  }
}
