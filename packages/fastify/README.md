# @prisma-query/fastify

Fastify adapter for [@prisma-query/core](../core).

## Installation

```bash
pnpm add @prisma-query/core @prisma-query/fastify
```

## Usage

```typescript
import Fastify from 'fastify';
import { fastifyQuery } from '@prisma-query/fastify';
import { toPrismaQuery, response } from '@prisma-query/core';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify();
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

fastify.get('/api/users', { preHandler: fastifyQuery(config) }, async (req) => {
  const query = req.prismaQuery;
  const prismaObject = toPrismaQuery(query, config);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(prismaObject),
    prisma.user.count({ where: prismaObject.where }),
  ]);

  return response(query, users, total);
});

fastify.listen({ port: 3000 });
```

## Builder Variant

`fastifyQueryBuilder` attaches both `req.prismaQuery` and `req.prismaObject`:

```typescript
import { fastifyQueryBuilder } from '@prisma-query/fastify';

fastify.get('/api/users', { preHandler: fastifyQueryBuilder(config) }, async (req) => {
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany(req.prismaObject),
    prisma.user.count({ where: req.prismaObject.where }),
  ]);

  return response(req.prismaQuery, users, total);
});
```

## License

MIT
