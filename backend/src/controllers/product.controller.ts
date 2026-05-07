import { Response, NextFunction } from 'express';
import { TenantRequest } from '../middleware/tenant';
import {
  createProduct,
  listProducts,
  getProductById,
  getProductPriceHistory,
  getCompetitorPrices,
  deleteProduct,
} from '../services/product.service';

export const create = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { asin, title, imageUrl, brand, category } = req.body;

    if (!asin || !title) {
      res.status(400).json({
        status: 'error',
        message: 'asin and title are required',
      });
      return;
    }

    const product = await createProduct({
      asin,
      title,
      imageUrl,
      brand,
      category,
      tenantId: req.tenantId!,
    });

    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const list = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '20');

    const result = await listProducts(req.tenantId!, {
      search,
      category,
      page,
      limit,
    });

    res.json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await getProductById(req.params.id as string, req.tenantId!);
    res.json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const getPriceHistory = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const source = req.query.source as string | undefined;
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    const result = await getProductPriceHistory(
      req.params.id as string,
      req.tenantId!,
      { source, days }
    );

    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getCompetitors = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await getCompetitorPrices(req.params.id as string, req.tenantId!);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteProduct(req.params.id as string, req.tenantId!);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};