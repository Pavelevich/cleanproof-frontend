# CleanProof

Privacy-preserving transactions on Solana using Zero-Knowledge Proofs.

## Overview

CleanProof enables private transactions on Solana while maintaining regulatory compliance through Proof of Innocence - a mechanism based on Vitalik Buterin's Privacy Pools paper. Users can prove their funds are NOT from illicit sources without revealing their identity.

### Features

- **Private Deposits** - Deposit SOL into privacy pools with ZK commitments
- **Anonymous Withdrawals** - Withdraw to any address using ZK proofs
- **Proof of Innocence** - Generate compliance proofs without compromising privacy
- **Association Sets** - Choose from verified, institutional, or community-curated deposit sets
- **Relayer Support** - Optional relayer for maximum transaction privacy

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Blockchain**: Solana, Anchor Framework
- **ZK Circuits**: Circom, snarkjs
- **Wallets**: Phantom, Solflare, Torus, Ledger

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Pavelevich/cleanproof-frontend.git

# Navigate to project directory
cd cleanproof-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

### Deposit

1. Connect your Solana wallet
2. Select a fixed denomination pool (for better anonymity) or enter a custom amount
3. Generate your secret note - **save this securely!**
4. Confirm the deposit transaction

### Withdraw

1. Paste or upload your secret note
2. Enter recipient address (can be different from deposit address)
3. Optionally enable relayer for enhanced privacy
4. Generate ZK proof and withdraw

### Prove Innocence

1. Upload your secret note
2. Select an association set (verified deposits, institutional, etc.)
3. Generate and download your Proof of Innocence

## Architecture

```
src/
├── components/
│   ├── bridge/          # Deposit, Withdraw, Prove tabs
│   └── ui/              # shadcn/ui components
├── hooks/
│   └── usePrivacyVault.ts  # Solana program interactions
├── lib/
│   ├── zkProofs.ts      # ZK proof generation
│   ├── tokens.ts        # Token configurations
│   └── relayer.ts       # Relayer service
└── providers/
    └── WalletProvider.tsx  # Solana wallet adapter
```

## Network

Currently deployed on Solana Devnet. Mainnet deployment coming soon.

## Security

- Secret notes are generated client-side and never transmitted
- ZK proofs ensure transaction unlinkability
- Association sets are maintained by trusted providers

## Links

- [GitHub](https://github.com/Pavelevich/privacy-vault)
- [Community](https://x.com/i/communities/1863652235382755685)

## License

MIT
