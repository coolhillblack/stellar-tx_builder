# stellar-tx-builder

> A visual, embeddable React component for building Stellar transactions step-by-step.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/stellar-tx-builder.svg)](https://www.npmjs.com/package/stellar-tx-builder)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**stellar-tx-builder** fills a real gap in the Stellar ecosystem: there is no open-source, embeddable React component that lets developers or end users construct and preview Stellar transactions visually. Stellar Lab exists, but it's SDF's internal tool — not embeddable, not customizable, and not Wave-eligible. This library changes that.

---

## Demo

```
npm install
npm run dev
```

Open `http://localhost:5173` to see the live demo.

---

## Installation

```bash
npm install stellar-tx-builder
# or
yarn add stellar-tx-builder
```

> **Peer dependencies**: `react >= 18`, `react-dom >= 18`

---

## Quick Start

```tsx
import { TransactionBuilder } from 'stellar-tx-builder';
import 'stellar-tx-builder/dist/index.css';

export default function MyDApp() {
  return (
    <TransactionBuilder
      network="testnet"
      onXDR={(xdr) => console.log('XDR:', xdr)}
      onSigned={(signedXdr) => console.log('Signed:', signedXdr)}
      onSubmitted={(result) => console.log('Result:', result)}
    />
  );
}
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `network` | `"mainnet" \| "testnet" \| "custom"` | `"testnet"` | Stellar network to use |
| `networkPassphrase` | `string` | — | Required when `network="custom"` |
| `horizonUrl` | `string` | — | Custom Horizon URL (uses defaults otherwise) |
| `sourceAccount` | `string` | — | Pre-fill the source account field |
| `onXDR` | `(xdr: string) => void` | — | Called when unsigned XDR is generated |
| `onSigned` | `(signedXdr: string) => void` | — | Called when transaction is signed |
| `onSubmitted` | `(result: SubmitResult) => void` | — | Called on successful submission |
| `showSubmit` | `boolean` | `true` | Whether to show the submit step |
| `className` | `string` | — | Additional CSS class for root element |

---

## Supported Operations

| Category | Operations |
|----------|-----------|
| **Payments** | Payment, Path Payment (Strict Send/Receive) |
| **DEX Offers** | Manage Buy Offer, Manage Sell Offer |
| **Account** | Create Account, Set Options, Account Merge, Manage Data, Bump Sequence |
| **Trustlines** | Change Trust, Allow Trust |
| **Advanced** | Create/Claim Claimable Balance, Begin/End Sponsoring Future Reserves, Revoke Sponsorship, Clawback |
| **Soroban** | Invoke Host Function |

---

| `theme`             | `"dark" | "light"`                 | `"dark"`    | Visual theme for the component        |

## Advanced Usage

### Composable Steps

Use individual steps in your own flow:

```tsx
import {
  ConfigureStep,
  OperationsStep,
  PreviewStep,
  SignStep,
  useTransactionState,
} from 'stellar-tx-builder';

function CustomBuilder() {
  const { state, setStep, setParams, addOperation } = useTransactionState();
  // Render steps selectively in your own layout
}
```

### Hook Only

```tsx
import { useTransactionState, buildTransaction } from 'stellar-tx-builder';

function HeadlessBuilder() {
  const { state, addOperation, updateOperation } = useTransactionState();

  const handleBuild = async () => {
    const xdr = await buildTransaction(state, 'testnet');
    // Use XDR however you want
  };
}
```

---

## Architecture

```
stellar-tx-builder/
├── src/
│   ├── components/
│   │   ├── TransactionBuilder/   # Main component + 5 step components
│   │   └── ui/                   # Reusable: StepIndicator, AssetInput, Field
│   ├── hooks/
│   │   └── useTransactionState   # Reducer-based state management
│   ├── lib/
│   │   ├── stellar.ts            # SDK wrappers (build, sign, submit)
│   │   └── operationDefinitions  # All 23+ op type definitions
│   └── types/                    # Full TypeScript type exports
└── demo/                         # Vite-powered showcase app
```

---

## Development

```bash
# Install dependencies
npm install

# Start demo with hot reload
npm run dev

# Build the library
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Key areas where help is needed:
- Additional operation types (see open issues)
- Wallet adapter integration (Freighter, Albedo, xBull)
- Soroban argument builder (visual XDR argument construction)
- Accessibility improvements
- Theme customization API

---

## Roadmap

- [x] Core 5-step builder flow
- [x] All 23+ operation types
- [x] In-browser signing with secret key
- [x] External XDR signing support
- [ ] Wallet adapters (Freighter, Albedo)
- [ ] Multi-signature support UI
- [ ] Soroban argument builder
- [ ] Light theme
- [ ] Storybook documentation
- [ ] Figma component kit

---

## License

[MIT](LICENSE) © stellar-tx-builder contributors

---

## Acknowledgements

Built with the [Stellar JavaScript SDK](https://github.com/stellar/js-stellar-sdk). Inspired by [Stellar Laboratory](https://laboratory.stellar.org/).
