# Contributing to @prisma-query

We welcome contributions! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/your-org/prisma-query.git
cd prisma-query

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Build
pnpm build
```

## Project Structure

```
prisma-query/
├── packages/
│   ├── core/          # Core library
│   ├── express/       # Express adapter
│   ├── next/          # Next.js adapter
│   ├── nest/          # NestJS adapter
│   └── fastify/       # Fastify adapter
├── examples/          # Example applications
├── benchmark/         # Performance benchmarks
└── .github/           # CI/CD workflows
```

## Adding a Feature

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Write tests for your feature
4. Ensure all tests pass: `pnpm test`
5. Submit a pull request

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- No comments in code (use clear naming)
- Tests required for all new features

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `test:` — Tests
- `refactor:` — Code refactoring

## Releasing

We use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
pnpm changeset
pnpm version-packages
pnpm release
```
