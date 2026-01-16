<p align="center">
  <img src="public/favicon.jpg" width="120" alt="CleanProof Logo" />
</p>

<h1 align="center">CleanProof</h1>

<p align="center">
  <strong>Privacy-Preserving Transactions on Solana</strong>
</p>

<p align="center">
  <a href="https://solana.com"><img src="https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat-square&logo=solana" alt="Solana" /></a>
  <a href="https://reactjs.org"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" /></a>
</p>

<p align="center">
  <a href="https://x.com/i/communities/1863652235382755685">Community</a> •
  <a href="https://github.com/Pavelevich/privacy-vault">Smart Contracts</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## What is CleanProof?

CleanProof brings **compliant privacy** to Solana. Based on [Vitalik Buterin's Privacy Pools paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364), it enables users to transact privately while proving their funds are not from illicit sources.

> **"Privacy is normal. Privacy is not secrecy."**

### The Problem

Traditional mixers offer privacy but can't distinguish between legitimate users and bad actors. This creates regulatory challenges and reputational risks.

### The Solution

CleanProof introduces **Proof of Innocence** - a zero-knowledge mechanism that lets users prove membership in a set of verified "clean" deposits without revealing which specific deposit is theirs.

---

## Features

| Feature | Description |
|---------|-------------|
| **Private Deposits** | Deposit SOL into privacy pools using cryptographic commitments |
| **Anonymous Withdrawals** | Withdraw to any address with ZK proofs - no link to original deposit |
| **Proof of Innocence** | Generate compliance proofs without compromising privacy |
| **Association Sets** | Verified, institutional, or community-curated deposit pools |
| **Relayer Network** | Optional relayers pay gas fees for maximum unlinkability |

---

## How It Works

```
┌─────────────┐     ZK Commitment      ┌──────────────┐
│   Deposit   │ ───────────────────▶   │  Privacy     │
│   (User A)  │                        │    Pool      │
└─────────────┘                        └──────────────┘
                                              │
                                              │ ZK Proof
                                              ▼
┌─────────────┐     Verified Withdrawal ┌──────────────┐
│  Withdraw   │ ◀─────────────────────  │  Association │
│   (User B)  │                         │     Set      │
└─────────────┘                         └──────────────┘
```

1. **Deposit**: User deposits SOL and receives a secret note (ZK commitment)
2. **Pool**: Funds are mixed with other deposits in the privacy pool
3. **Withdraw**: User generates a ZK proof to withdraw to any address
4. **Compliance**: Optional Proof of Innocence shows funds aren't from flagged sources

---

## Tech Stack

<table>
<tr>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" width="48" /><br />
<strong>Solana</strong>
</td>
<td align="center" width="150">
<img src="https://vitejs.dev/logo.svg" width="48" /><br />
<strong>Vite</strong>
</td>
<td align="center" width="150">
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="48" /><br />
<strong>React</strong>
</td>
<td align="center" width="150">
<img src="https://www.svgrepo.com/show/374146/typescript-official.svg" width="48" /><br />
<strong>TypeScript</strong>
</td>
</tr>
</table>

- **Smart Contracts**: Anchor Framework (Rust)
- **ZK Circuits**: Circom + snarkjs
- **Styling**: Tailwind CSS + shadcn/ui
- **Wallets**: Phantom, Solflare, Torus, Ledger

---

## Getting Started

### Prerequisites

- Node.js 18+
- Solana wallet (Phantom recommended)

### Installation

```bash
git clone https://github.com/Pavelevich/cleanproof-frontend.git
cd cleanproof-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── bridge/
│   │   ├── DepositTab.tsx      # Deposit interface
│   │   ├── WithdrawTab.tsx     # Withdrawal with ZK proofs
│   │   └── ProveTab.tsx        # Proof of Innocence generation
│   └── ui/                     # Reusable UI components
├── hooks/
│   └── usePrivacyVault.ts      # Solana program interactions
├── lib/
│   ├── zkProofs.ts             # ZK proof generation (snarkjs)
│   ├── associationSets.ts      # Compliance set definitions
│   └── relayer.ts              # Relayer service integration
└── providers/
    └── WalletProvider.tsx      # Multi-wallet support
```

---

## Security

- **Client-side key generation**: Secret notes never leave your device
- **Zero-knowledge proofs**: Cryptographic privacy guarantees
- **Audited circuits**: ZK circuits reviewed for soundness
- **Open source**: Full transparency of all code

---

## Roadmap

- [x] Devnet deployment
- [x] Core deposit/withdraw functionality
- [x] Proof of Innocence implementation
- [ ] Mainnet launch
- [ ] Mobile app
- [ ] Multi-token support
- [ ] Decentralized relayer network

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## Links

<p align="center">
  <a href="https://x.com/i/communities/1863652235382755685">
    <img src="https://img.shields.io/badge/X-Community-000000?style=for-the-badge&logo=x" alt="X Community" />
  </a>
  <a href="https://github.com/Pavelevich/privacy-vault">
    <img src="https://img.shields.io/badge/GitHub-Smart_Contracts-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
</p>

---

<p align="center">
  <sub>Built with privacy in mind</sub>
</p>
