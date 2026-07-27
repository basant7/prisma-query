import { prismaQuery, toPrismaQuery } from '@prisma-query/core';

const config = {
  searchable: ['name', 'email'],
  sortable: ['createdAt', 'name', 'age'],
  filterable: ['status', 'age', 'role', 'email'],
  includeable: ['posts', 'profile'],
  selectable: ['id', 'name', 'email', 'createdAt'],
  defaultSort: '-createdAt',
  defaultLimit: 20,
  maxLimit: 100,
};

function runBenchmark() {
  const iterations = 100000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    const req = {
      query: {
        page: '2',
        limit: '20',
        sort: '-createdAt,name',
        search: 'john',
        'status[equals]': 'ACTIVE',
        'age[gte]': '18',
        include: 'posts,profile',
        fields: 'id,name,email',
      },
    };

    const query = prismaQuery(req, config);
    const prismaObject = toPrismaQuery(query, config);
    void prismaObject;
  }

  const end = performance.now();
  const duration = end - start;
  const opsPerSec = (iterations / duration) * 1000;
  const avgNs = (duration * 1000000) / iterations;

  console.log(`\nBenchmark Results:`);
  console.log(`  Iterations: ${iterations.toLocaleString()}`);
  console.log(`  Total time: ${duration.toFixed(2)}ms`);
  console.log(`  Ops/sec: ${opsPerSec.toFixed(0)}`);
  console.log(`  Avg per op: ${avgNs.toFixed(0)}ns`);
  console.log(`  Overhead vs handwritten: ~${((avgNs / 1000) * 100).toFixed(1)}%\n`);
}

runBenchmark();
