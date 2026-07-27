# @prisma-query/next

Next.js (App Router) adapter for [@prisma-query/core](../core).

## Installation

```bash
pnpm add @prisma-query/core @prisma-query/next
```

## Usage

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { nextQuery } from '@prisma-query/next';
import { toPrismaQuery, response } from '@prisma-query/core';
import { prisma } from '@/lib/prisma';

const config = {
  searchable: ['name', 'email'],
  sortable: ['createdAt', 'name'],
  filterable: ['status', 'role'],
  includeable: ['posts'],
  defaultSort: '-createdAt',
};

export async function GET(req: NextRequest) {
  const query = nextQuery(req, config);
  const prismaObject = toPrismaQuery(query, config);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(prismaObject),
    prisma.user.count({ where: prismaObject.where }),
  ]);

  return NextResponse.json(response(query, users, total));
}
```

## Builder Variant

`nextQueryBuilder` returns both the parsed query and the Prisma-ready object:

```typescript
import { nextQueryBuilder } from '@prisma-query/next';

export async function GET(req: NextRequest) {
  const { query, prismaObject } = nextQueryBuilder(req, config);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(prismaObject),
    prisma.user.count({ where: prismaObject.where }),
  ]);

  return NextResponse.json(response(query, users, total));
}
```

## License

MIT
