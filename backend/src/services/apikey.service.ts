import { randomBytes, createHash } from 'crypto';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

// Generate a secure random API key
export const generateApiKey = (): string => {
  return `ap_${randomBytes(32).toString('hex')}`;
};

// Hash the key before storing — we only store the hash, never the raw key
export const hashApiKey = (key: string): string => {
  return createHash('sha256').update(key).digest('hex');
};

export const createApiKey = async (userId: string, name: string) => {
  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      key: hashedKey,
      name,
      userId,
    },
  });

  // Return the raw key only once — we never show it again
  return {
    id: apiKey.id,
    name: apiKey.name,
    key: rawKey, // shown only this one time
    createdAt: apiKey.createdAt,
  };
};

export const listApiKeys = async (userId: string) => {
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      lastUsed: true,
      createdAt: true,
      // Never return the hashed key
    },
  });

  return keys;
};

export const revokeApiKey = async (keyId: string, userId: string) => {
  const key = await prisma.apiKey.findFirst({
    where: { id: keyId, userId },
  });

  if (!key) {
    throw new AppError('API key not found', 404);
  }

  await prisma.apiKey.delete({ where: { id: keyId } });

  return { message: 'API key revoked successfully' };
};

export const validateApiKey = async (rawKey: string) => {
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: {
      user: {
        select: {
          id: true,
          tenantId: true,
          role: true,
        },
      },
    },
  });

  if (!apiKey) {
    return null;
  }

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date() },
  });

  return apiKey.user;
};