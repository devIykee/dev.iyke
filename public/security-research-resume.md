# Iyke - Security Research Resume

## Contact

eokorie1911@gmail.com · Iyke.dev · github.com/devIykee · @deviykee · Remote / Nigeria

## Summary

Independent smart-contract security researcher. 11 vulnerabilities privately disclosed across
EVM launchpads, CDP/stablecoin engines and reward systems — 7 High severity. One confirmed
production fix shipped by the vendor with no user funds lost. Verification is fork and
`eth_call` only, with reproducible Foundry PoCs and honest impact bounds.

## Technical Skills - Security

- **Languages:** Solidity, Rust, Python, TypeScript, Bash
- **Security tools:** Foundry (forge/cast/anvil), fork PoC harnesses, Slither, Echidna, Sourcify, Blockscout API, bytecode/selector analysis
- **Blockchain:** EVM internals (CREATE prediction, nonce/revert semantics, `slot0`), Uniswap V2/V3/V4 core + periphery, bonding curves, LP locking, CDP collateral & liquidation, oracle quorum models, flash-loan manipulation
- **Methods:** smart-contract auditing, vulnerability research, severity bounding, access-control & DoS review, threat modeling, static/dynamic analysis, reversing unverified bytecode, responsible disclosure

## Security Research Projects

**Openfair — V3 graduation pool squat (High).** Pre-created pool at an attacker-set price absorbed
the ~5 ETH community raise; the pad never validated `slot0`. **Disclosed privately — vendor shipped
v2.0, retroactively protected all earlier launches, zero user funds lost.**

**The Index — Flash-loanable distribution snapshot (High).** Payout snapshot read live `balanceOf`
with no checkpoint or hold period, letting a borrowed position collect a whale's share of every
cycle. Proven with a Foundry PoC mirroring production logic.

**Merry Men / PumpClaw — V4 pre-init factory freeze (High).** `initializePool` soft-fails on an
existing pool; pre-initing the factory's next predicted CREATE address bricked `createToken`
permanently, since the revert rolls the nonce back. Verified on an Anvil fork.

**StockDotFun — V4 pre-init graduation freeze (High).** Gas-only, zero-inventory pool squat forced
`MIGRATION_FAILED`, trapping a launch's full ~4.4 ETH raise with no in-protocol recovery path.

**HoodRich / RobinPump — Zero-min V2 migration (High).** Graduation deposited the raise with
`amountTokenMin`/`amountETHMin` both `0`. Found by differential review — a sibling factory in the
same codebase already checked `slot0`, and a competitor used 95% mins for the identical call.

**Also disclosed:** Robinlaunch V3 pool squat and Robinfun pair-pollution freeze (both High);
xStocks CDP single-reporter oracle trust flaw and unminted borrow-fee debt; HoodCash permanently
burned reward accrual; SLVR delegate claim redirect (Medium).

## Research & Tools

- **Bug-hunt toolkit** — 10-step gate-driven pipeline in Bash/Python: RPC ground-truth gating, creator trace + frontend bundle grep for core discovery, surface mapping (codesize/Sourcify/selectors), unauthenticated `eth_call` auth triage, Foundry fork-PoC scaffolding, report and disclosure generators, selftest harness.
- **Bughunt playbook** (`iykes-web3-bughunt-skill`) — the audit method the toolkit implements: intake, per-step decision gates, PoC and report templates, "kill your own finding" severity discipline, fork-only rules of engagement.
- **Ecosystem sweep** — ~30 Robinhood Chain protocols triaged, with negative results held to the same standard as positives.

## Professional Experience

**Independent Security Researcher** | 2026 - Present
- 11 findings across launchpads, CDP engines, mining pools and distribution systems; every report states an explicit impact bound and what the finding is *not*.
- Specialized in AMM pool-initialization attack surface — a bug class recurring across nearly every bonding-curve launchpad audited.

**Freelance Blockchain Developer, CribX** | Aug 2026 - Present
- Audited and completed a multi-chain deposit system (BTC/ETH/SOL/USDT/USDC) in a NestJS/Prisma/BullMQ backend; hardened the credit path against replay-driven double-crediting within BitGo and Tatum trust boundaries.

**Selected secure protocol work** — Covenant, attestation-gated treasury on Stacks (**2nd place, FlowVault
hackathon**); Skimflow, x402 micropayment settlement with USDC on Arc; Freelance Escrow in Rust/Stylus;
technical audit of CredChain.

## Education

**B.Eng. Software Engineering**, Federal University of Technology Owerri — 2023-2028 (in progress)
