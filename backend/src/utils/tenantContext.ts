import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

export const createTenantContext = (tenantId: string) => {
  return {
    products: {
      findMany: (args?: Omit<Prisma.ProductFindManyArgs, 'where'> & { where?: Prisma.ProductWhereInput }) =>
        prisma.product.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),

      findFirst: (args?: Omit<Prisma.ProductFindFirstArgs, 'where'> & { where?: Prisma.ProductWhereInput }) =>
        prisma.product.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),

      create: (data: Omit<Prisma.ProductUncheckedCreateInput, 'tenantId'>) =>
        prisma.product.create({
          data: { ...data, tenantId },
        }),

      update: (id: string, data: Prisma.ProductUncheckedUpdateInput) =>
        prisma.product.updateMany({
          where: { id, tenantId },
          data,
        }),

      delete: (id: string) =>
        prisma.product.deleteMany({
          where: { id, tenantId },
        }),

      count: (args?: Omit<Prisma.ProductCountArgs, 'where'> & { where?: Prisma.ProductWhereInput }) =>
        prisma.product.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    },

    alerts: {
      findMany: (args?: Omit<Prisma.AlertFindManyArgs, 'where'> & { where?: Prisma.AlertWhereInput }) =>
        prisma.alert.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),

      findFirst: (args?: Omit<Prisma.AlertFindFirstArgs, 'where'> & { where?: Prisma.AlertWhereInput }) =>
        prisma.alert.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),

      create: (data: Omit<Prisma.AlertUncheckedCreateInput, 'tenantId'>) =>
        prisma.alert.create({
          data: { ...data, tenantId },
        }),

      update: (id: string, data: Prisma.AlertUncheckedUpdateInput) =>
        prisma.alert.updateMany({
          where: { id, tenantId },
          data,
        }),

      delete: (id: string) =>
        prisma.alert.deleteMany({
          where: { id, tenantId },
        }),

      count: (args?: Omit<Prisma.AlertCountArgs, 'where'> & { where?: Prisma.AlertWhereInput }) =>
        prisma.alert.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    },
  };
};

export type TenantContext = ReturnType<typeof createTenantContext>;