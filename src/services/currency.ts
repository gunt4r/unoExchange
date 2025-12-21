// src/services/CurrencyService.ts
import { getDataSource } from '@/libs/DB';
import { Currency } from '@/models/currency';
import { Repository } from 'typeorm';

export class CurrencyService {
  private async getRepository(): Promise<Repository<Currency>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Currency);
  }

  // Создать валюту
  async createCurrency(data: {
    code: string;
    name: string;
    rateToZL: number;
    imageUrl?: string;
    reserve?: number;
    isBase?: boolean;
  }): Promise<Currency> {
    const repository = await this.getRepository();
    
    try {
    if (data.isBase) {
      data.rateToZL = 1;
    }

    const currency = repository.create(data);
    return await repository.save(currency);
    } catch (error) {
      console.error('Error creating currency:', error);
      throw error;
    }
  }

  async getAllCurrencies(): Promise<Currency[]> {
    const repository = await this.getRepository();
    return await repository.find({
      order: { isBase: 'DESC', code: 'ASC' }
    });
  }

  async getActiveCurrencies(): Promise<Currency[]> {
    const repository = await this.getRepository();
    return await repository.find({
      where: { isActive: true },
      order: { isBase: 'DESC', code: 'ASC' }
    });
  }

  async getCurrencyById(id: number): Promise<Currency | null> {
    const repository = await this.getRepository();
    return await repository.findOne({ where: { id } });
  }

  async updateCurrency(id: number, data: Partial<Currency>): Promise<Currency | null> {
    const repository = await this.getRepository();
    await repository.update(id, data);
    return await this.getCurrencyById(id);
  }

  async deleteCurrencyById(id: number): Promise<boolean> {
    const repository = await this.getRepository();
    const result = await repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async convert(fromCode: string, toCode: string, amount: number): Promise<{
    fromCurrency: Currency;
    toCurrency: Currency;
    fromAmount: number;
    toAmount: number;
    rate: number;
  }> {
    const repository = await this.getRepository();
    
    const fromCurrency = await repository.findOne({ 
      where: { code: fromCode, isActive: true } 
    });
    
    const toCurrency = await repository.findOne({ 
      where: { code: toCode, isActive: true } 
    });

    if (!fromCurrency || !toCurrency) {
      throw new Error('Валюта не найдена');
    }

    const amountInZl = amount / Number(fromCurrency.rateToZL);
    const result = amountInZl * Number(toCurrency.rateToZL);
    
    const rate = Number(toCurrency.rateToZL) / Number(fromCurrency.rateToZL);

    return {
      fromCurrency,
      toCurrency,
      fromAmount: amount,
      toAmount: Number(result.toFixed(2)),
      rate: Number(rate.toFixed(6))
    };
  }
}