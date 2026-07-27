import { NextRequest } from 'next/server';
import {
  prismaQuery,
  toPrismaQuery,
  type QueryConfig,
  type ParsedQuery,
  type PrismaQueryObject,
} from '@prisma-query/core';

export function nextQuery(
  req: NextRequest,
  config?: QueryConfig,
): ParsedQuery {
  const url = new URL(req.url);
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return prismaQuery({ query }, config);
}

export function nextQueryBuilder(
  req: NextRequest,
  config?: QueryConfig,
): { query: ParsedQuery; prismaObject: PrismaQueryObject } {
  const query = nextQuery(req, config);
  const prismaObject = toPrismaQuery(query, config);
  return { query, prismaObject };
}

export { toPrismaQuery };
export type { ParsedQuery, PrismaQueryObject };
