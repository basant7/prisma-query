# @prisma-query/express

Express adapter for [@prisma-query/core](../core).

## Installation

```bash
pnpm add @prisma-query/core @prisma-query/express
```

## Usage

```typescript
import { expressQuery } from '@prisma-query/express';
import { toPrismaQuery, response } from '@prisma-query/core';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const config = {
  searchable: ['name', 'email'],
  sortable: ['createdAt', 'name'],
  filterable: ['status', 'role'],
  includeable: ['posts'],
  defaultSort: '-createdAt',
  defaultLimit: 20,
  maxLimit: 100,
};

// Middleware parses query and attaches req.prismaQuery
app.get('/api/users', expressQuery(config), async (req, res) => {
  const query = req.prismaQuery;
  const prismaObject = toPrismaQuery(query, config);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(prismaObject),
    prisma.user.count({ where: prismaObject.where }),
  ]);

  res.json(response(query, users, total));
});
```

## Builder Variant

Also available as `expressQueryBuilder` which attaches both `req.prismaQuery` and `req.prismaObject` (ready for `findMany()`):

```typescript
import { expressQueryBuilder } from '@prisma-query/express';

app.get('/api/users', expressQueryBuilder(config), async (req, res) => {
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(req.prismaObject),
    prisma.user.count({ where: req.prismaObject.where }),
  ]);

  res.json(response(req.prismaQuery, users, total));
});
```

## License

MIT
