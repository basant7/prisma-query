import type { Request, Response, NextFunction } from 'express';
import {
  prismaQuery,
  toPrismaQuery,
  type QueryConfig,
  type ParsedQuery,
  type PrismaQueryObject,
} from '@prisma-query/core';

export interface ExpressQueryOptions extends QueryConfig {
  onError?: (error: Error, req: Request, res: Response) => void;
}

export function expressQuery(options: QueryConfig = {}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const query = prismaQuery(
      { query: req.query as Record<string, string> },
      options,
    );
    (req as Request & { prismaQuery: ParsedQuery }).prismaQuery = query;
    next();
  };
}

export function expressQueryBuilder(options: QueryConfig = {}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const query = prismaQuery(
      { query: req.query as Record<string, string> },
      options,
    );
    const prismaQueryObj = toPrismaQuery(query, options);
    (req as Request & { prismaQuery: ParsedQuery; prismaObject: PrismaQueryObject }).prismaQuery = query;
    (req as Request & { prismaQuery: ParsedQuery; prismaObject: PrismaQueryObject }).prismaObject = prismaQueryObj;
    next();
  };
}

export { toPrismaQuery };
export type { ParsedQuery, PrismaQueryObject };
