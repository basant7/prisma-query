# @prisma-query/nest

NestJS adapter for [@prisma-query/core](../core).

## Installation

```bash
pnpm add @prisma-query/core @prisma-query/nest
```

## Usage

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
    defaultLimit: 20,
    maxLimit: 100,
  }),
)
export class UsersController {
  constructor(private prisma: PrismaClient) {}

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

## How It Works

The `PrismaQueryInterceptor` is a NestJS interceptor that:

1. Parses query parameters from the request
2. Attaches `req.prismaQuery` (parsed query object)
3. Attaches `req.prismaObject` (ready for `findMany()`)

## License

MIT
