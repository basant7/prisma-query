import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  prismaQuery,
  toPrismaQuery,
  type QueryConfig,
  type ParsedQuery,
  type PrismaQueryObject,
} from '@prisma-query/core';

export function fastifyQuery(options: QueryConfig = {}) {
  return async (req: FastifyRequest, _reply: FastifyReply) => {
    const query = prismaQuery(
      { query: req.query as Record<string, string> },
      options,
    );
    (req as FastifyRequest & { prismaQuery: ParsedQuery }).prismaQuery = query;
  };
}

export function fastifyQueryBuilder(options: QueryConfig = {}) {
  return async (req: FastifyRequest, _reply: FastifyReply) => {
    const query = prismaQuery(
      { query: req.query as Record<string, string> },
      options,
    );
    const prismaQueryObj = toPrismaQuery(query, options);
    (req as FastifyRequest & { prismaQuery: ParsedQuery; prismaObject: PrismaQueryObject }).prismaQuery = query;
    (req as FastifyRequest & { prismaQuery: ParsedQuery; prismaObject: PrismaQueryObject }).prismaObject = prismaQueryObj;
  };
}

export { toPrismaQuery };
export type { ParsedQuery, PrismaQueryObject };
