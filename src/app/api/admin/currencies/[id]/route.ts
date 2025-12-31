import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CurrencyService } from '@/services/currency';

const currencyService = new CurrencyService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const updatedCurrency = await currencyService.updateCurrency(id, body);

    if (!updatedCurrency) {
      return NextResponse.json(
        { error: 'Валюта не найдена' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedCurrency);
  } catch (error: any) {
    console.error('Error updating currency:', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Валюта с таким кодом уже существует' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Error updating currency' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const deleted = await currencyService.deleteCurrencyById(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Валюта не найдена' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json(
      { error: 'Error deleting currency' },
      { status: 500 },
    );
  }
}
