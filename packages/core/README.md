# @prisma-query/core

The Prisma equivalent of mongoose-paginate-v2. Parse, validate, and transform HTTP query parameters into Prisma-ready objects.

[![npm version](https://img.shields.io/npm/v/@prisma-query/core.svg)](https://www.npmjs.com/package/@prisma-query/core)
[![license](https://img.shields.io/npm/l/@prisma-query/core.svg)](https://github.com/basant7/prisma-query/blob/main/LICENSE)

## Quick Start

```typescript
import { prismaQuery, toPrismaQuery, response } from '@prisma-query/core';

const query = prismaQuery(req, {
  searchable: ['name', 'email'],
  sortable: ['createdAt', 'name'],
  filterable: ['status', 'age'],
  includeable: ['posts'],
  defaultSort: '-createdAt',
  maxLimit: 100,
});

const users = await prisma.user.findMany(toPrismaQuery(query));
const total = await prisma.user.count({ where: toPrismaQuery(query).where });

res.json(response(query, users, total));
```

## Features

- **Pagination** — `?page=2&limit=20`
- **Cursor Pagination** — `?cursor=abc123`
- **Sorting** — `?sort=-createdAt,name`
- **Filtering** — `?status=ACTIVE`, `?age[gte]=18`, `?status[in]=ACTIVE,PENDING`
- **Search** — `?search=john`
- **Include** — `?include=posts,profile`
- **Select** — `?fields=id,name,email`
- **Security** — Allow-list based field validation
- **Type Safety** — Autocomplete valid fields from Prisma schema
- **Framework Adapters** — Express, Next.js, NestJS, Fastify

## Documentation

See the [full README](../../README.md) for complete documentation.

## License

MIT
