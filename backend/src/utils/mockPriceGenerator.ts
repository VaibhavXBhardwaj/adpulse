import { addBulkPricePoints } from '../services/pricepoint.service';
import { logger } from '../config/logger';

interface GenerateMockPricesOptions {
  productId: string;
  basePrice: number;
  days?: number;
  intervalHours?: number;
}

const fluctuate = (basePrice: number, maxPercent: number = 5): number => {
  const change = basePrice * (maxPercent / 100);
  const delta = Math.random() * change * 2 - change;
  return Math.round((basePrice + delta) * 100) / 100;
};

export const generateMockPrices = async (
  options: GenerateMockPricesOptions
): Promise<void> => {
  const { productId, basePrice, days = 30, intervalHours = 6 } = options;

  const sources: Record<string, number> = {
    own: basePrice,
    competitor_a: basePrice * 0.95,
    competitor_b: basePrice * 1.03,
  };

  const pricePoints: {
    productId: string;
    price: number;
    source: string;
    currency: string;
    recordedAt: Date;
  }[] = [];

  const totalIntervals = (days * 24) / intervalHours;
  const now = new Date();

  for (let i = totalIntervals; i >= 0; i--) {
    const recordedAt = new Date(now);
    recordedAt.setHours(now.getHours() - i * intervalHours);

    for (const [source, base] of Object.entries(sources)) {
      pricePoints.push({
        productId,
        price: fluctuate(base, 8),
        source,
        currency: 'USD',
        recordedAt: new Date(recordedAt),
      });
    }
  }

  const batchSize = 100;
  for (let i = 0; i < pricePoints.length; i += batchSize) {
    const batch = pricePoints.slice(i, i + batchSize);
    await addBulkPricePoints(batch);
  }

  logger.info('Mock prices generated', {
    productId,
    totalPoints: pricePoints.length,
    days,
  });
};