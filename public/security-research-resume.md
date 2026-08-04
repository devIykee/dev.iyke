# Iyke - Security Research Resume

## Contact

Iyke (devIykee / deviykee) — Independent Web3 Security Researcher
eokorie1911@gmail.com | 09132313421 | Iyke.dev | github.com/devIykee | @deviykee | Remote / Nigeria

## Summary

Independent smart-contract security researcher focused on EVM launchpads, bonding-curve
graduation flows, CDP/stablecoin engines, and reward-distribution systems. Runs a repeatable
ten-step hunt pipeline — intake and RPC ground-truth gating, core discovery, surface mapping,
unauthenticated-call triage, Foundry fork PoC, severity bounding, private disclosure — backed by
tooling I wrote and maintain. Seven High-severity and four Medium/latent findings privately
disclosed across launchpad, CDP and mining protocols on Robinhood Chain (chainId 4663); Openfair
shipped a v2.0 fix and retroactively protected earlier launches with no user funds lost.
All verification is fork / `eth_call` / local Foundry only — never mainnet exploitation — with
honest, explicitly stated impact bounds. Also a full-stack engineer (Next.js, NestJS, Rust,
Solidity), which is where the secure-design and defensive-review perspective comes from.

## Technical Skills - Security

**Languages** — Solidity, Rust, Python, TypeScript, JavaScript, Bash, Clarity

**Security Tools** — Foundry (`forge`, `cast`, `anvil`, `chisel`), fork-based PoC harnesses,
Sourcify verification lookups, Blockscout API v2, bytecode/selector extraction, custom
`eth_call` auth-triage and recon scripts, Slither and Echidna workflows (via vendored
`smart-contracts-audit-foundry-slither` and `sc-auditor` methodology packs)

**Frameworks** — Foundry / forge-std, Hardhat-equivalent workflows, OpenZeppelin contracts,
Uniswap V2 / V3 / V4 core + periphery (PoolManager, PositionManager, `initializePool`,
`createAndInitializePoolIfNecessary`), ERC-20 / ERC-165 / ERC-1363, EIP-712

**Blockchain** — EVM internals (CREATE address prediction, nonce/revert semantics, storage
layout, `slot0`), Robinhood Chain (L2, 4663), Arbitrum / Arc, Solana, Stacks; bonding curves,
AMM pool initialization and migration, LP locking/burning, CDP collateral and liquidation,
oracle quorum and reporter models, flash-loan / same-block balance manipulation

**Methodologies** — smart-contract auditing, protocol analysis, vulnerability research,
severity bounding, root-cause analysis, DoS/griefing analysis, access-control review,
precision/rounding review, reentrancy review, threat modeling, static analysis, dynamic
analysis (fork simulation), recon and attack-surface mapping, reverse engineering of
unverified bytecode, responsible disclosure

**Infrastructure** — Git/GitHub, Docker, Anvil local forks, JSON-RPC / `eth_call` tooling,
Node.js, PostgreSQL, Redis/BullMQ, Vercel, Supabase

**Operating Systems** — Linux (Debian/Ubuntu), Termux + proot Ubuntu, macOS-compatible tooling

## Security Research Projects

All findings verified fork / `eth_call` / local-Foundry only. No mainnet state touched.
Targets are on Robinhood Chain (chainId 4663) unless noted.

**Openfair — Uniswap V3 graduation / seed pool squat (High).** `createAndInitializePoolIfNecessary`
silently reuses an attacker-pre-created pool at an arbitrary price; the pad then seeds the ~5 ETH
community raise into that rigged market without validating `slot0` against its computed price.
Instant-listing and single-sided paths shared the flaw. **Privately disclosed; Openfair shipped a
v2.0 fix and retroactively protected all earlier launches — no user funds lost.**

**The Index (theindex.finance) — Flash-loanable distribution snapshot (High).** The stock-payout
snapshot reads *live* `balanceOf` at a permissionlessly triggerable moment, with no checkpoint,
minimum hold, or historical freeze. An attacker borrows INDEX, is counted as a whale, returns it,
and still collects the payout — repeatable, unauthenticated, bounded by
`flashable_INDEX / eligible_INDEX` of each cycle's pot. Proved with a local Foundry PoC mirroring
production snapshot/distribute logic (`src/theindex`), plus read-only on-chain confirmation.

**Merry Men (PumpClaw) — Uniswap V4 pre-init factory freeze (High).** `positionManager.initializePool`
soft-fails on an already-initialized pool (returns `type(int24).max` instead of reverting) and the
factory checks neither the return value nor `slot0`. Pre-initializing the pool for the factory's
next *predicted* CREATE address makes `createToken` revert during mint settlement
(`CurrencyNotSettled`); the revert rolls the nonce back, so the same address is predicted forever
and the launchpad is permanently bricked. Verified on a local Anvil fork.

**StockDotFun — Uniswap V4 pre-init graduation freeze (High).** The graduation locker calls hard
`PoolManager.initialize`, which reverts if the pool key already exists. Any stranger can initialize
it first for gas alone and zero token inventory. The curve then marks `MIGRATION_FAILED` with
buy/sell already disabled, trapping that launch's full principal (~4.41 ETH graduation target) with
no owner recovery or alternate-key migration path in the verified source. Control flow proven with
local Foundry unit tests.

**Robinlaunch — Uniswap V3 migration / Direct Pool squat (High).** Same class as Openfair against a
different pad: the ~2.5 ETH bonding raise and LP inventory are deposited into a pre-created,
attacker-priced pool, which the attacker then arbitrages. Verified against fully verified Blockscout
source with a local Foundry test mirroring the vulnerable call sequence.

**HoodRich / RobinPump — Zero-min V2 graduation deposit (High).** Migration calls
`addLiquidityETH(token, LP_SUPPLY, 0, 0, DEAD, block.timestamp)` — both `amountTokenMin` and
`amountETHMin` are zero — so a pre-skewed V2 pair absorbs the raise at a hostile ratio. Bounded to
that token's tier (~1.5 / 3.5 / 6 ETH). Identified by differential review: Novapex uses 95% mins for
the identical operation, and HoodRich's own `RobinPumpMeme` factory already checks `slot0`
(`PoolPriceMismatch`) — only the main curve factory used 0%.

**Robinfun — Cheap V2 pair pollution graduation freeze (High).** Once `readyToGraduate` is true,
curve exits are disabled and only `graduate` can complete. Seeding the V2 pair with dust WETH
(~0.000003 ETH against a 3 ETH LP slice) fails the pad's pollution check and reverts graduation
indefinitely. The only escape is an owner-only path that sweeps the entire raise to treasury rather
than refunding buyers. Verified against Factory V2 source with local Foundry unit tests; live
Factory V5 (unverified) exposes the same surface.

**xStocks CdpEngine / EquityOracle — Single-reporter oracle trust model (Trust/Centralization,
High impact).** The live CDP with real TVL still reads EquityOracle **V1** at `quorum = 1` with a
single reporter address identical to the CDP owner, so one key defines the collateral price used
for both minting and liquidation — mint against fake highs, or liquidate against fake lows. The
project's own V2 oracle source calls this the "arbitrary-price drain" class, which is why V2
enforces minimum quorum 2 and a median of independent reporters. Established read-only across four
engines and both oracle versions.

**xStocks CdpEngine — Unminted borrow-fee debt (Medium, latent).** `borrowFeeBps` is added to a
user's debt but never minted as stable tokens, so total debt outgrows circulating supply and the
fee portion can eventually only be repaid by burning stable that was never created. Dormant while
`borrowFeeBps == 0` on all engines checked — reported as a latent accounting footgun that arms
itself the moment fees are enabled.

**HoodCash MiningPool — Permanently burned reward accrual (Medium).** If the pool holds less HCASH
than has accrued, a claim pays only the remaining balance yet still advances the staker's
"claimed-through" marker. The shortfall is destroyed and never recoverable, even after a refill.
No admin key needed; any staker triggers it on their own rewards. Verified with a local Foundry PoC
mirroring live claim accounting, plus read-only balance checks.

**SLVR — Lottery delegate claim redirect (Medium).** `approveDelegate` grants recipient choice, not
just the right to claim: via `claimAdvanced`, an approved-but-hostile or compromised delegate can
route a winner's ETH and SLVR to itself. Official helpers (AutoCommit, ClaimLocker, MultiClaim)
hardcode safe recipients, and the project's own `SlvrMultiClaim` source documents why a generic
multicall cannot safely be a delegate. Cross-checked against MultiClaim and AutoCommit V1/V2.

**Robinhood Chain ecosystem sweep (~30 targets).** Value-ranked target lists and per-target hunt
workspaces (`hunts/`, `targets/`) covering Bankr, Bow, Clanker, Flap, Foragepad, Greenwood, HOODIES,
HoodTech, Leavehood, MetaLaunch, NockTerminal, Novapex, Noxa, Pons, Primehod, Recurve, RevShare,
RobinLaunchpad, RobinPad, RoughLaunch, Slops and more. Includes negative results held to the same
standard as positives — e.g. Pons was cleared because single-sided seeding plus `PoolAlreadyExists`
kills the classic V3 squat, and Novapex was cleared on 95% slippage mins.

## Research & Tools

**`security-research` — private research workspace** (github.com/devIykee/security-research).
Hunt workflow scripts, per-target workspaces, Foundry PoCs, disclosure drafts, target scoring, and
dated session bundles. Structure: `scripts/` `config/` `docs/` `src/` `hunts/` `reports/`
`targets/` `sessions/` `vendor/`.

**Bug-hunt toolkit (`scripts/`)** — ten mechanical steps that keep judgment in the analyst and
repetition in the shell. Every script is gate-driven with explicit exit codes:

- `step1-ground-truth.sh` — RPC liveness + chain-id match gate; kills dead or spoofed RPCs before any time is spent.
- `step2-creator-trace.sh` — token/position → creator (factory/core) via Blockscout API v2.
- `step2-bundle-grep.sh` — scrapes Vite/Next frontend bundles for role-labeled `0x` addresses, surfacing config addresses not published anywhere else.
- `step3-surface-map.sh` — balance, code size, Sourcify verification match, bytecode and tx selector extraction; routes verified vs. unverified analysis paths.
- `step4-auth-triage.sh` — `eth_call`s admin/keeper signatures *as the attacker*, flagging `OPEN <-- CHECK` for missing access control.
- `step7-poc-scaffold.sh` — generates a Foundry PoC project and a SAFE fork-only test skeleton pinned to a fork block, printing the exact `forge test --fork-url` invocation.
- `step9-report-skeleton.py` — fills the standard report structure (intake, severity, bound, affected contracts, root cause, remediation) so every writeup is directly comparable.
- `step10-dm-skeleton.py` — generates the first private disclosure message; consistent, non-extortionate first contact.
- `selftest.sh` — CI-style smoke test asserting every script fails gracefully with correct usage and exit codes.

**`iykes-web3-bughunt-skill`** — the end-to-end playbook the toolkit implements (`docs/skills/`,
`SKILL.md`). Codifies the intake block, per-step decision gates, PoC and report templates, severity
bounding and "kill your own finding" discipline, the fork/`eth_call`-only rule, and a routing table
into EVM audit checklists (general, precision-math, DeFi/AMM, ERC-20, access-control, DoS,
flash-loans, chain-specific) by product type. Also encodes cost discipline: cheap models and
read-only explore subagents for mechanical probes, primary model reserved for severity calls,
root-cause reading, and exploit sequencing.

**Foundry PoC projects** — `src/theindex` (flash-inflated snapshot: `FlashSnapshot.t.sol`,
`ForkFlashSnapshot.t.sol`, `LocalFlashSnapshot.t.sol`, with `MockIndex.sol` and
`VulnerableDistributor.sol` reproducing production logic), `sessions/2026-08-03/poc`
(`MiningPoolBug.sol` / `MiningPoolBug.t.sol`), and per-hunt PoCs under `hunts/*/poc`. Standard
profile: solc 0.8.26, `via_ir`, cancun, `ffi = false`, and no broadcast — tests cannot touch mainnet
by construction.

**Source reconstruction workspaces** — `hunts/` holds pulled verified sources for triage:
StockDotFun (`Factory`, `GraduationManager`, `UniswapV4GraduationAdapter`, `V4LiquidityLocker`,
`BondingCurvePoolV2`), MetaLaunch (`MetaLaunchFactoryV12`, `Create2Deployer`, `MetaLocker`), Pons
(`PonsLaunchFactory`, `PonsLiquidityMath`, `PonsTickMath`), Primehod (`PrimehodFactory`,
`PrimehodCurve`, `PrimehodV3Locker`), HoodRich (`RobinPump`, `RobinPumpMeme`), plus the SLVR stack
(~40 contracts: lottery, vote-escrow, jackpot, tax handler, claim lockers) and the xStocks CDP stack
(`CdpEngine`, `CdpEngine_OLD`, `EquityOracle`, `EquityOracleV2`) for V1-vs-V2 differential review.

**Reports and disclosure corpus** — ~30 hunt notes, 11 severity-rated findings, and matching private
DM drafts under `reports/`, with dated session bundles under `sessions/`. Every report opens with a
plain-language explanation, states an explicit impact bound, and separately documents what the
finding is *not* — the discipline that keeps severities honest.

**Vendored methodology packs** — `awesome-web3-security`, `evm-audit-skills`, `sc-auditor`,
`smart-contracts-audit-foundry-slither`, `web3-bug-bounty-hunting-ai-skills`.

## Professional Experience

**Independent Security Researcher** | 2026 to Present
- Ran a full-ecosystem audit sweep of ~30 Robinhood Chain protocols, producing 7 High-severity and 4 Medium/latent/trust findings across launchpads, CDP engines, mining pools and distribution systems.
- Disclosed a High-severity graduation-flow vulnerability to @OpenFairApp; the team shipped a v2.0 fix and retroactively protected all earlier launches, with no user funds lost.
- Built and maintain the ten-step hunt toolchain and disclosure pipeline above, turning recon, surface mapping, auth triage, PoC scaffolding and report generation into gate-driven scripts.
- Specialized in AMM pool-initialization attack surface — V3 `createAndInitializePoolIfNecessary` price reuse, V4 `initializePool` soft-fail vs. hard-revert semantics, and V2 zero-slippage migration — a class that recurs across nearly every bonding-curve launchpad.
- Practice strict rules of engagement: fork / `eth_call` verification only, private disclosure until patched, and severity bounded to demonstrated impact rather than headline maximums.

**Freelance Blockchain Developer, CribX (Contract)** | Aug 2026 to Present
- Contracted to **audit** and complete a multi-chain deposit system (BTC, ETH, SOL, USDT-TRC20, USDC) inside an existing NestJS/Prisma/BullMQ backend — reviewing custody and monitoring integrations before extending them.
- Hardened the deposit credit path around **idempotency**, so replayed or duplicated chain events cannot double-credit user balances — the core correctness risk in any exchange deposit pipeline.
- Worked within BitGo custody and Tatum chain-monitoring boundaries, implementing per-user deposit address derivation and rate integration feeding an existing PalmPay payout flow, with a threat-model view of the custody/monitoring trust boundaries.

**Community Lead, FBC Blockchain Club (FUTO)** | Jan 2026 to Present
- Lead a small team running the club's technical presence and official website.
- Ran a 30-day daily marathon teaching blockchain fundamentals from first principles — PoW, PoS, Solana PoH — including the consensus and incentive-design assumptions that determine where protocols actually break.

**Secure Protocol Engineering (selected build work)**
- **Skimflow** (skimflow.xyz) — pay-per-block content monetization for humans and AI agents over x402 micropayments; Circle wallet + USDC settlement on Arc Testnet and a `RevenueSplit` contract (80% creator share), designed against payment-replay and settlement-authorization abuse. Submitted to the Lepton Agents Hackathon ($50K pool); applied for a $7,000 Stacks Endowment grant.
- **Covenant** (thecovenant.vercel.app) — conditional treasury on FlowVault (Stacks) releasing funds only after independent judge attestation, i.e. an escrow trust model built to resist unilateral release. **Won 2nd place ($200) in the FlowVault hackathon.**
- **Freelance Escrow** — Rust/Stylus on-chain escrow with AI dispute resolution for milestone payments; Ethereum Lima Hackathon 2026 (Arbitrum track), solo entry.
- **OSUSU** — Solana ROSCA platform; authored the full spec covering escrow custody, majority-vote payout governance and default handling — the adversarial cases that decide whether a savings circle can be griefed.
- **CredChain** — conducted a technical audit of a web3 talent and credential platform.
- **solana-surgeon-skill** — agent skill for surgical Solana development, submitted as PR #62 to `solanabr/skill-bounty`.

## Certifications

None currently held. Practical work is evidenced by the disclosed findings, reproducible Foundry
PoCs, and published tooling above.

## Education

**Federal University of Technology Owerri (FUTO)** — B.Eng. Software Engineering, 2023 to 2028 (in progress)
