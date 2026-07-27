import { NextRequest, NextResponse } from 'next/server';
import { nextQuery, nextQueryBuilder } from '@prisma-query/next';

const config = {
  searchable: ['name', 'email'],
  sortable: ['createdAt', 'name'],
  filterable: ['status', 'role'],
  includeable: ['posts'],
  defaultSort: '-createdAt',
};

export async function GET(req: NextRequest) {
  const { query, prismaObject } = nextQueryBuilder(req, config);

  // const users = await prisma.user.findMany(prismaObject);
  // const total = await prisma.user.count({ where: prismaObject.where });

  return NextResponse.json({
    success: true,
    data: [],
    meta: { page: query.pagination.page, total: 0 },
  });
}
