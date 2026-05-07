import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

interface AddPricePointInput {
  productId: string;
  price: number;
  source: string;
  currency?: string;
  recordedAt?: Date;
}

export const addPricePoint = async (input: AddPricePointInput) => {
  const { productId, price, source, currency = 'USD', recordedAt } = input;

  const pricePoint = await prisma.pricePoint.create({
    data: {
      productId,
      price,
      source,
      currency,
      ...(recordedAt && { recordedAt }),
    },
  });

  return pricePoint;
};

export const addBulkPricePoints = async (inputs: AddPricePointInput[]) => {
  const pricePoints = await prisma.pricePoint.createMany({
    data: inputs.map((i) => ({
      productId: i.productId,
      price: i.price,
      source: i.source,
      currency: i.currency || 'USD',
      ...(i.recordedAt && { recordedAt: i.recordedAt }),
    })),
  });

  return pricePoints;
};

export const getTimeSeriesData = async (
  productId: string,
  tenantId: string,
  days: number = 30
) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const since = new Date();
  since.setDate(since.getDate() - days);

  const timeSeries = await prisma.$queryRaw`
    SELECT
      DATE("recordedAt") as date,
      source,
      ROUND(AVG(price)::numeric, 2) as avg_price,
      MIN(price) as min_price,
      MAX(price) as max_price
    FROM "PricePoint"
    WHERE "productId" = ${productId}
    AND "recordedAt" >= ${since}
    GROUP BY DATE("recordedAt"), source
    ORDER BY date ASC, source ASC
  ` as {
    date: Date;
    source: string;
    avg_price: number;
    min_price: number;
    max_price: number;
  }[];

  return { product, timeSeries };
};

export const getLatestPriceBySource = async (productId: string) => {
  const latest = await prisma.$queryRaw`
    SELECT DISTINCT ON (source) source, price, currency, "recordedAt"
    FROM "PricePoint"
    WHERE "productId" = ${productId}
    ORDER BY source, "recordedAt" DESC
  ` as {
    source: string;
    price: number;
    currency: string;
    recordedAt: Date;
  }[];

  return latest;
};

export const getPriceSummary = async (
  productId: string,
  tenantId: string
) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const [ownLatest, competitorPrices] = await Promise.all([
    prisma.pricePoint.findFirst({
      where: { productId, source: 'own' },
      orderBy: { recordedAt: 'desc' },
    }),
    prisma.$queryRaw`
      SELECT DISTINCT ON (source) source, price, "recordedAt"
      FROM "PricePoint"
      WHERE "productId" = ${productId}
      AND source != 'own'
      ORDER BY source, "recordedAt" DESC
    ` as unknown as { source: string; price: number; recordedAt: Date }[],
  ]);

  const ownPrice = ownLatest?.price ?? null;

  const competitorGaps = (competitorPrices as { source: string; price: number; recordedAt: Date }[]).map((c) => ({
    source: c.source,
    price: c.price,
    gap: ownPrice !== null ? Number((ownPrice - c.price).toFixed(2)) : null,
    gapPercent:
      ownPrice !== null && c.price > 0
        ? Number((((ownPrice - c.price) / c.price) * 100).toFixed(2))
        : null,
  }));

  return {
    product,
    ownPrice,
    competitorGaps,
  };
};