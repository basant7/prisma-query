import express from 'express';
import { expressQuery, expressQueryBuilder } from '@prisma-query/express';
import { toPrismaQuery, response } from '@prisma-query/core';

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
  const query = (req as any).prismaQuery;
  const prismaObject = toPrismaQuery(query, config);

  // const users = await prisma.user.findMany(prismaObject);
  // const total = await prisma.user.count({ where: prismaObject.where });

  // Example response
  const users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ];
  const total = 2;

  res.json(response(query, users, total));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
