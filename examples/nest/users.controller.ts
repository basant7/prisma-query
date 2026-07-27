import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { PrismaQueryInterceptor } from '@prisma-query/nest';

@Controller('users')
@UseInterceptors(
  new PrismaQueryInterceptor({
    searchable: ['name', 'email'],
    sortable: ['createdAt', 'name'],
    filterable: ['status', 'role'],
    defaultSort: '-createdAt',
  }),
)
export class UsersController {
  @Get()
  findAll(@Req() req: any) {
    const { prismaQuery, prismaObject } = req;
    // Use prismaObject with Prisma
    return {
      success: true,
      data: [],
      meta: { page: prismaQuery.pagination.page, total: 0 },
    };
  }
}
