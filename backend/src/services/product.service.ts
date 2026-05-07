import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

interface CreateProductInput {
  asin: string;
  title: string;
  imageUrl?: string;
  brand?: string;
  category?: string;
  tenantId: string;
}

export const createProduct = async (input: CreateProductInput) => {
  const { asin, tenantId } = input;

  const existing = await prisma.product.findUnique({
    where: { asin_tenantId: { asin, tenantId } },
  });

  if (existing) {
    throw new AppError('Product with this ASIN is already being tracked', 409);
  }

  const product = await prisma.product.create({
    data: input,
  });

  return product;
};

export const listProducts = async (
  tenantId: string,
  options: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const { search, category, page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const where = {
    tenantId,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { asin: { contains: search, mode: 'insensitive' as const } },
        { brand: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(category && { category }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: { priceHistory: true, alerts: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: { id, tenantId },
    include: {
      _count: {
        select: { priceHistory: true, alerts: true },
      },
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const getProductPriceHistory = async (
  productId: string,
  tenantId: string,
  options: {
    source?: string;
    days?: number;
  } = {}
) => {
  const { source, days = 30 } = options;

  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const since = new Date();
  since.setDate(since.getDate() - days);

  const priceHistory = await prisma.pricePoint.findMany({
    where: {
      productId,
      recordedAt: { gte: since },
      ...(source && { source }),
    },
    orderBy: { recordedAt: 'asc' },
  });

  return { product, priceHistory };
};

export const getCompetitorPrices = async (
  productId: string,
  tenantId: string
) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const latestPrices = await prisma.$queryRaw`
    SELECT DISTINCT ON (source) source, price, "recordedAt"
    FROM "PricePoint"
    WHERE "productId" = ${productId}
    ORDER BY source, "recordedAt" DESC
  ` as { source: string; price: number; recordedAt: Date }[];

  return { product, latestPrices };
};

export const deleteProduct = async (id: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: { id, tenantId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await prisma.product.delete({ where: { id } });

  return { message: 'Product deleted successfully' };
};