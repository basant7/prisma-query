import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  prismaQuery,
  toPrismaQuery,
  type QueryConfig,
  type ParsedQuery,
} from '@prisma-query/core';

@Injectable()
export class PrismaQueryInterceptor {
  constructor(private config: QueryConfig = {}) {}

  intercept(context: ExecutionContext, next: any) {
    const request = context.switchToHttp().getRequest();
    const query = prismaQuery(
      { query: request.query },
      this.config,
    );
    request.prismaQuery = query;
    request.prismaObject = toPrismaQuery(query, this.config);
    return next.handle();
  }
}

export function createPrismaQuery(config: QueryConfig = {}) {
  return new PrismaQueryInterceptor(config);
}

export { prismaQuery, toPrismaQuery };
export type { ParsedQuery };
