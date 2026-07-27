<p align="center">
  <h1 align="center">@prisma-query/core</h1>
  <p align="center">The Prisma equivalent of mongoose-paginate-v2</p>
  <p align="center">Parse, validate, and transform HTTP query parameters into Prisma-ready objects.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@prisma-query/core"><img src="https://img.shields.io/npm/v/@prisma-query/core.svg" alt="npm version"></a>
  <a href="https://github.com/your-org/prisma-query/actions"><img src="https://github.com/your-org/prisma-query/workflows/CI/badge.svg" alt="CI"></a>
  <a href="https://github.com/your-org/prisma-query/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@prisma-query/core.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@prisma-query/core"><img src="https://img.shields.io/npm/dm/@prisma-query/core.svg" alt="npm downloads"></a>
</p>

---

## Why?

Every REST API needs the same thing: parse `?page=2&sort=-createdAt&status=ACTIVE` into something Prisma understands. You end up writing the same boilerplate in every project. `@prisma-query/core` eliminates that.

**Before:**
```typescript
// 20+ lines of manual parsing in every route
const page = Number(req.query.page) || 1;
const limit = Math.min(Number(req.query.limit) || 20, 100);
const sort = req.query.sort?.toString().split(',').map(f => ({
  [f.replace('-', '')]: f.startsWith('-') ? 'desc' : 'asc'
}));
// ... and so on
```

**After:**
```typescript
const query = prismaQuery(req, config);
const data = await prisma.user.findMany(toPrismaQuery(query, config));
return res.json(response(query, data, total));
```

## Features

| Feature | Query Parameter | Example |
|---------|----------------|---------|
| Pagination | `page`, `limit` | `?page=2&limit=20` |
| Cursor Pagination | `cursor`, `limit` | `?cursor=abc123&limit=20` |
| Sorting | `sort` | `?sort=-createdAt,name` |
| Filtering | `[operator]` | `?age[gte]=18&status[in]=ACTIVE,PENDING` |
| Search | `search` or `q` | `?search=john` |
| Include Relations | `include` | `?include=posts,profile` |
| Field Selection | `fields` | `?fields=id,name,email` |
| Date Ranges | `[from]`, `[to]` | `?createdAt[from]=2024-01-01` |
| Type Safety | TypeScript | Autocomplete valid fields from Prisma schema |
| Security | Allow-lists | Non-allowed fields silently ignored |
| Framework Adapters | Express, Next.js, NestJS, Fastify | Drop-in middleware |

## Installation

```bash
# Core
pnpm add @prisma-query/core

# With framework adapter
pnpm add @prisma-query/core @prisma-query/express
pnpm add @prisma-query/core @prisma-query/next
pnpm add @prisma-query/core @prisma-query/nest
pnpm add @prisma-query/core @prisma-query/fastify
```

## Complete Example

### Express

```typescript
import express from 'express';
import { expressQuery } from '@prisma-query/express';
import { toPrismaQuery, response } from '@prisma-query/core';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

const config = {
  searchable: ['name', 'email'],
  sortable: ['createdAt', 'name', 'age'],
  filterable: ['status', 'age', 'role'],
  includeable: ['posts', 'profile'],
  selectable: ['id', 'name', 'email', 'createdAt'],
  defaultSort: '-createdAt',
  defaultLimit: 20,
  maxLimit: 100,
};

app.get('/api/users', expressQuery(config), async (req, res) => {
  const query = req.prismaQuery;
  const prismaObject = toPrismaQuery(query, config);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(prismaObject),
    prisma.user.count({ where: prismaObject.where }),
  ]);

  res.json(response(query, users, total));
});

app.listen(3000);
```

### Next.js (App Router)

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

### NestJS

```typescript
import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { PrismaQueryInterceptor } from '@prisma-query/nest';
import { toPrismaQuery, response } from '@prisma-query/core';

@Controller('users')
@UseInterceptors(
  new PrismaQueryInterceptor({
    searchable: ['name', 'email'],
    sortable: ['createdAt', 'name'],
    filterable: ['status', 'role'],
    includeable: ['posts'],
    defaultSort: '-createdAt',
  }),
)
export class UsersController {
  @Get()
  async findAll(@Req() req: any) {
    const prismaObject = toPrismaQuery(req.prismaQuery);

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany(prismaObject),
      this.prisma.user.count({ where: prismaObject.where }),
    ]);

    return response(req.prismaQuery, users, total);
  }
}
```

### Fastify

```typescript
import Fastify from 'fastify';
import { fastifyQuery } from '@prisma-query/fastify';
import { toPrismaQuery, response } from '@prisma-query/core';

const fastify = Fastify();
const config = { /* ... */ };

fastify.get('/api/users', { preHandler: fastifyQuery(config) }, async (req) => {
  const prismaObject = toPrismaQuery(req.prismaQuery, config);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(prismaObject),
    prisma.user.count({ where: prismaObject.where }),
  ]);

  return response(req.prismaQuery, users, total);
});

fastify.listen({ port: 3000 });
```

## Response Format

### Paginated Response

```json
GET /api/users?page=2&limit=20

{
  "success": true,
  "data": [
    { "id": 21, "name": "John", "email": "john@example.com" }
  ],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 900,
    "pages": 45,
    "next": 3,
    "previous": 1,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

### Cursor Response

```json
GET /api/users?cursor=abc123&limit=20

{
  "success": true,
  "data": [...],
  "meta": {
    "nextCursor": "def456",
    "previousCursor": "abc123",
    "hasNext": true,
    "hasPrevious": true,
    "take": 20
  }
}
```

## Query Parameters

### Pagination

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (min: 1) |
| `limit` | number | `20` | Items per page (max: `maxLimit` config) |

### Cursor Pagination

| Parameter | Type | Description |
|-----------|------|-------------|
| `cursor` | string | Cursor value from previous response |
| `limit` | number | Items to return |

### Sorting

| Syntax | Direction | Example |
|--------|-----------|---------|
| `sort=field` | Ascending | `?sort=name` |
| `sort=-field` | Descending | `?sort=-createdAt` |
| `sort=field1,-field2` | Mixed | `?sort=name,-age` |

### Filtering

| Operator | Syntax | Example | Description |
|----------|--------|---------|-------------|
| equals | `field=value` | `?status=ACTIVE` | Exact match |
| equals | `field[equals]=value` | `?status[equals]=ACTIVE` | Exact match |
| not | `field[not]=value` | `?status[not]=BLOCKED` | Not equal |
| gt | `field[gt]=value` | `?age[gt]=18` | Greater than |
| gte | `field[gte]=value` | `?age[gte]=18` | Greater than or equal |
| lt | `field[lt]=value` | `?age[lt]=65` | Less than |
| lte | `field[lte]=value` | `?age[lte]=65` | Less than or equal |
| in | `field[in]=v1,v2` | `?status[in]=ACTIVE,PENDING` | In list |
| notIn | `field[notIn]=v1,v2` | `?status[notIn]=BLOCKED` | Not in list |
| contains | `field[contains]=v` | `?name[contains]=john` | String contains |
| startsWith | `field[startsWith]=v` | `?name[startsWith]=A` | String starts with |
| endsWith | `field[endsWith]=v` | `?email[endsWith]=@co` | String ends with |

### Search

| Parameter | Example | Description |
|-----------|---------|-------------|
| `search` | `?search=john` | Searches all `searchable` fields |
| `q` | `?q=john` | Alias for `search` |

### Include & Select

| Parameter | Example | Description |
|-----------|---------|-------------|
| `include` | `?include=posts,profile` | Include relations |
| `fields` | `?fields=id,name,email` | Select specific fields |

## Configuration

```typescript
interface QueryConfig {
  // Fields that can be searched
  searchable?: string[];        // default: []

  // Fields that can be sorted
  sortable?: string[];          // default: []

  // Fields that can be filtered
  filterable?: string[];        // default: []

  // Relations that can be included
  includeable?: string[];       // default: []

  // Fields that can be selected
  selectable?: string[];        // default: []

  // Default sort when none specified (prefix with - for desc)
  defaultSort?: string;         // default: none

  // Default items per page
  defaultLimit?: number;        // default: 20

  // Maximum items per page
  maxLimit?: number;            // default: 100

  // Enable soft delete filtering
  softDelete?: boolean;         // default: false

  // Field name for soft delete
  softDeleteField?: string;     // default: 'deletedAt'

  // Search sensitivity
  searchMode?: 'insensitive' | 'sensitive'; // default: 'insensitive'
}
```

## Builder API

For fine-grained control over which modules process the query:

```typescript
import { PrismaQueryBuilder } from '@prisma-query/core';

const query = new PrismaQueryBuilder(req, config)
  .addPagination()
  .addSort()
  .addSearch()
  .addFilters()
  .addInclude()
  .addSelect()
  .build();
```

Each `.add*()` call is optional — only process what you need.

## Security

All field access is **allow-listed**. Any field not in the config is silently ignored.

```typescript
const config = {
  sortable: ['name', 'createdAt'],
  filterable: ['status', 'role'],
  includeable: ['posts'],
};
```

```
GET /api/users?sort=password        → Ignored (password not in sortable)
GET /api/users?include=secretData   → Ignored (secretData not in includeable)
GET /api/users?hack[equals]=1       → Ignored (hack not in filterable)
```

## How It Works

```
HTTP Request
    │
    ▼
┌─────────┐
│ Parser  │  Extract query parameters
└────┬────┘
     │
     ▼
┌───────────┐
│ Validator │  Check against allow-lists
└────┬──────┘
     │
     ▼
┌──────────────┐
│ Transformers │  Convert to Prisma format
└────┬─────────┘
     │
     ▼
┌──────────────┐
│ Prisma Object │  { where, orderBy, skip, take, include, select }
└────┬─────────┘
     │
     ▼
  findMany()
```

## TypeScript Type Safety

Infer types directly from your Prisma schema for compile-time validation:

```typescript
import type { User } from '@prisma/client';

const query = prismaQuery<User>({
  searchable: ['name', 'email'],    // ✅ Valid fields
  sortable: ['createdAt'],
  // searchable: ['nam'],           // ❌ TypeScript error
});
```

## Alternatives

| Package | Type Safety | Allow-lists | Cursor | Framework Adapters | Maintenance |
|---------|:-----------:|:-----------:|:------:|:------------------:|:-----------:|
| **@prisma-query/core** | ✅ | ✅ | ✅ | ✅ (4) | Active |
| prisma-pagination | ❌ | ❌ | ❌ | ❌ | Low |
| express-prisma-paginate | ❌ | ❌ | ❌ | Express only | Low |
| Manual implementation | ❌ | ❌ | Varies | ❌ | N/A |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

MIT
