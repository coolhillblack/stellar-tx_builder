# Contributing to stellar-tx-builder

Thank you for your interest in contributing! This document outlines how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/stellar-tx-builder.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feat/your-feature`
5. Start the dev server: `npm run dev`

## Project Structure

- `src/components/TransactionBuilder/` — The main component and step sub-components
- `src/components/ui/` — Shared UI primitives (inputs, indicators)
- `src/lib/` — Stellar SDK wrappers and operation definitions
- `src/hooks/` — React hooks for state management
- `src/types/` — TypeScript types
- `demo/` — Demo application (Vite + React)

## Adding a New Operation Type

1. Add the operation to `src/types/index.ts` in the `OperationType` union
2. Add the operation definition to `src/lib/operationDefinitions.ts`
3. Add the SDK builder case to `src/lib/stellar.ts` in `buildOperation()`
4. Test with the demo app

## Code Style

- TypeScript strict mode is enabled — no `any` types
- Components use inline Tailwind classes (no separate CSS files except `src/styles/index.css`)
- All exported components and hooks must have TypeScript types

## Pull Request Process

1. Make sure `npm run typecheck` and `npm run lint` pass
2. Update the README if you've added new props or exports
3. Add a clear description of what your PR does
4. Reference any related issues with `Fixes #N`

## Reporting Issues

Use GitHub Issues. Please include:
- Stellar SDK version
- React version
- Code to reproduce
- Expected vs actual behavior
