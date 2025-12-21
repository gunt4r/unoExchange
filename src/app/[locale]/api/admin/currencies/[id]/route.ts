// src/app/api/admin/currencies/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CurrencyService } from '@/services/currency';

const currencyService = new CurrencyService();

// PATCH - обновить валюту
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const existingCurrency = await currencyService.getCurrencyById(id);
    if (!existingCurrency) {
      return NextResponse.json(
        { error: 'Валюта не найдена' },
        { status: 404 }
      );
    }

    // Если это базовая валюта (USD), не даём менять rate
    if (existingCurrency.isBase && body.rateToZL && body.rateToZL !== 1) {
      return NextResponse.json(
        { error: 'Нельзя менять курс базовой валюты (USD всегда = 1)' },
        { status: 400 }
      );
    }

    const updatedCurrency = await currencyService.updateCurrency(id, body);

    return NextResponse.json(updatedCurrency);
  } catch (error) {
    console.error('Error updating currency:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении валюты' },
      { status: 500 }
    );
  }
}

// DELETE - удалить валюту
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const currency = await currencyService.getCurrencyById(id);
    if (!currency) {
      return NextResponse.json(
        { error: 'Валюта не найдена' },
        { status: 404 }
      );
    }

    // Не даём удалить базовую валюту
    if (currency.isBase) {
      return NextResponse.json(
        { error: 'Нельзя удалить базовую валюту (USD)' },
        { status: 400 }
      );
    }

    const deleted = await currencyService.deleteCurrencyById(id);

    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Не удалось удалить валюту' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении валюты' },
      { status: 500 }
    );
  }
}