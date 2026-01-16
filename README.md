<p align="center">
  <img src="https://img.shields.io/badge/Solana-Privacy%20Hack%202026-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana Privacy Hack 2026"/>
  <img src="https://img.shields.io/badge/ZK-Groth16-00D4AA?style=for-the-badge" alt="ZK Proofs"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React 18"/>
</p>

<h1 align="center">CleanProof Frontend</h1>

<p align="center">
  <strong>Privacy-Preserving Transactions UI for Solana</strong>
</p>

<p align="center">
  <a href="https://cleanproof.xyz">Live App</a> •
  <a href="https://github.com/Pavelevich/privacy-vault">Smart Contracts</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="https://x.com/i/communities/1863652235382755685">Community</a>
</p>

---

## Overview

Frontend application for **CleanProof** - a privacy protocol implementing [Vitalik Buterin's Privacy Pools](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364) on Solana. Users can transact privately while proving their funds aren't associated with illicit activity.

<p align="center">
  <a href="https://cleanproof.xyz">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-cleanproof.xyz-00D4AA?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

---

## Features

<table>
<tr>
<td width="50%">

### Private Deposits
- Fixed denomination pools (0.1, 1, 10 SOL)
- Custom amounts supported
- Cryptographic commitment generation

</td>
<td width="50%">

### Anonymous Withdrawals
- ZK proof generation in browser (~300ms)
- Withdraw to any address
- Optional relayer for gas privacy

</td>
</tr>
<tr>
<td width="50%">

### Proof of Innocence
- Multiple association sets
- Compliance without identity reveal
- Downloadable proof files

</td>
<td width="50%">

### Wallet Support
- Phantom
- Solflare
- Torus
- Ledger

</td>
</tr>
</table>

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLEANPROOF FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
  │   DEPOSIT    │         │   WITHDRAW   │         │    PROVE     │
  │              │         │              │         │  INNOCENCE   │
  │  ┌────────┐  │         │  ┌────────┐  │         │  ┌────────┐  │
  │  │ 1 SOL  │  │         │  │ Secret │  │         │  │ Assoc. │  │
  │  │        │──┼────────▶│  │  Note  │──┼────────▶│  │  Set   │  │
  │  └────────┘  │         │  └────────┘  │         │  └────────┘  │
  │      │       │         │      │       │         │      │       │
  │      ▼       │         │      ▼       │         │      ▼       │
  │  ┌────────┐  │         │  ┌────────┐  │         │  ┌────────┐  │
  │  │Commit- │  │         │  │ZK Proof│  │         │  │ZK Proof│  │
  │  │  ment  │  │         │  │Generated│ │         │  │ "I'm   │  │
  │  │ Hash   │  │         │  │        │  │         │  │ Clean" │  │
  │  └────────┘  │         │  └────────┘  │         │  └────────┘  │
  └──────────────┘         └──────────────┘         └──────────────┘
```

1. **Connect** - Link your Solana wallet
2. **Select Pool** - Choose denomination for optimal anonymity
3. **Generate Note** - Create cryptographic commitment
4. **Save Note** - Download secret note (required for withdrawal!)
5. **Deposit** - Send SOL to privacy pool
6. **Withdraw** - Use secret note + ZK proof to any address
7. **Prove** - Generate compliance proof if needed

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **ZK Proofs** | snarkjs (Groth16) |
| **Blockchain** | Solana Web3.js |
| **Wallets** | Solana Wallet Adapter |

---

## Project Structure

```
src/
├── components/
│   ├── bridge/
│   │   ├── DepositTab.tsx       # Deposit interface
│   │   ├── WithdrawTab.tsx      # Withdrawal with ZK proofs
│   │   └── ProveTab.tsx         # Proof of Innocence generation
│   ├── ui/                      # shadcn/ui components
│   ├── Header.tsx               # Navigation + wallet connect
│   └── StatusBar.tsx            # Footer with links
│
├── hooks/
│   └── usePrivacyVault.ts       # Solana program interactions
│
├── lib/
│   ├── zkProofs.ts              # ZK proof generation (snarkjs)
│   ├── associationSets.ts       # Compliance set definitions
│   ├── tokens.ts                # Token configurations
│   └── relayer.ts               # Relayer service integration
│
├── providers/
│   └── WalletProvider.tsx       # Multi-wallet support
│
└── public/circuits/             # Compiled WASM + zkey files
    ├── withdraw.wasm
    ├── withdraw_0000.zkey
    ├── innocence.wasm
    └── innocence_0000.zkey
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Solana wallet (Phantom recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Pavelevich/cleanproof-frontend.git
cd cleanproof-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

### Get Devnet SOL

```bash
solana airdrop 2 --url devnet
```

Or use the faucet: https://faucet.solana.com

---

## Related Repositories

| Repository | Description |
|------------|-------------|
| **[privacy-vault](https://github.com/Pavelevich/privacy-vault)** | Smart contracts, ZK circuits, relayer |
| **[cleanproof-frontend](https://github.com/Pavelevich/cleanproof-frontend)** | This repository - React frontend |

---

## Deployment

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | [cleanproof.xyz](https://cleanproof.xyz) | Live |
| **Network** | Solana Devnet | Live |
| **Mainnet** | Coming Soon | - |

---

## Security

| Do | Don't |
|----|-------|
| Save secret note securely | Share your secret note |
| Use fixed denominations | Use custom amounts (smaller anonymity set) |
| Wait between deposit/withdraw | Withdraw immediately after deposit |
| Use relayer for max privacy | Pay gas from same wallet |

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

```bash
# Run tests
npm test

# Lint
npm run lint

# Build
npm run build
```

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built for Solana Privacy Hack 2026</strong>
</p>

<p align="center">
  <a href="https://cleanproof.xyz">
    <img src="https://img.shields.io/badge/Website-cleanproof.xyz-9945FF?style=for-the-badge" alt="Website"/>
  </a>
  <a href="https://github.com/Pavelevich/privacy-vault">
    <img src="https://img.shields.io/badge/Smart%20Contracts-privacy--vault-181717?style=for-the-badge&logo=github" alt="Smart Contracts"/>
  </a>
  <a href="https://x.com/i/communities/1863652235382755685">
    <img src="https://img.shields.io/badge/Community-X-000000?style=for-the-badge&logo=x" alt="X Community"/>
  </a>
</p>
