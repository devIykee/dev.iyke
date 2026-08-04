import type {
  DevProject,
  MotionProject,
  WriterPost,
  Collaboration,
  ToolkitItem,
  HeroTag,
  TagShowcase,
} from "./types";

const SECURITY_REPO = "https://github.com/devIykee/security-research";
// Tag slug the Security Research showcase discovers projects by.
const SEC_TAG = "security-research";

/**
 * Placeholder content used only when Supabase env vars are absent, so the
 * site renders end-to-end before the database is wired. Copy mirrors the
 * approved design/code.html reference for the Developer persona.
 */

export const seedDevProjects: DevProject[] = [
  {
    id: "seed-dev-1",
    title: "System.Core",
    description:
      "High-performance rust-based microservice architecture for real-time data streaming.",
    screenshot_url: null,
    link: "#",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "seed-dev-2",
    title: "Nexus API",
    description:
      "GraphQL aggregation layer handling 10k+ requests/sec with edge caching.",
    screenshot_url: null,
    link: "#",
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "seed-dev-3",
    title: "Log_Parser",
    description:
      "CLI utility written in Go for distributed log analysis and anomaly detection.",
    screenshot_url: null,
    link: "#",
    created_at: "2026-01-03T00:00:00Z",
  },
  // Real Web3 security-research findings (deviykee), sourced from the
  // security-research workspace. Each carries the "security-research" tag, so
  // /tags/security-research picks them up automatically — no manual curation.
  {
    id: "seed-dev-sec-theindex",
    title: "The Index — Flash-Inflated Snapshot (High)",
    description:
      "Permissionless live-balanceOf distribution snapshot is flash-loanable: borrow INDEX, get counted as a whale, return it, still collect the stock payout. Proven with a local Foundry PoC mirroring production snapshot/distribute logic.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/theindex-high-flash-inflated-snapshot.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-21T00:00:00Z",
  },
  {
    id: "seed-dev-sec-hoodrich",
    title: "HoodRich / RobinPump — Zero-Min V2 Migration (High)",
    description:
      "Curve→Uniswap V2 graduation calls addLiquidityETH with amountTokenMin and amountETHMin both 0, so a pre-skewed pair absorbs the raise at a hostile ratio.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/hoodrich-high-v2-zero-min-migration.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-merrymen",
    title: "Merry Men / PumpClaw — V4 Pre-Init Factory Freeze (High)",
    description:
      "initializePool soft-fails on an existing pool and the factory never checks slot0, so pre-initing the next predicted CREATE address bricks createToken permanently. Verified on a local Anvil fork.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/merrymen-high-v4-preinit-factory-freeze.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-stockdotfun",
    title: "StockDotFun — V4 Pre-Init Graduation Freeze (High)",
    description:
      "Anyone can initialize the graduation pool key for gas alone; the locker's hard initialize then reverts, marking MIGRATION_FAILED and trapping the full ~4.4 ETH raise with no in-protocol recovery path.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/stockdotfun-high-v4-preinit-graduation-freeze.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-openfair",
    title: "Openfair — V3 Graduation Pool Squat (High)",
    description:
      "createAndInitializePoolIfNecessary reuses a stranger's pre-set price, so the community raise is seeded into an attacker-chosen market. Privately disclosed; Openfair shipped v2.0 and retroactively protected earlier launches — no user funds lost.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/openfair-high-v3-migration-pool-squat.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-robinlaunch",
    title: "Robinlaunch — V3 Migration Pool Squat (High)",
    description:
      "Same root cause class as Openfair: graduation and Direct Pool paths pour the ~2.5 ETH raise into a pre-created, fake-priced V3 pool without validating slot0 against the computed price.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/robinlaunch-high-v3-migration-pool-squat.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-robinfun",
    title: "Robinfun — Pair-Pollution Graduation Freeze (High)",
    description:
      "Dust-level WETH on the V2 pair (~0.000003 ETH against a 3 ETH LP slice) fails the pad's pollution check, freezing graduation while curve exits are already disabled. Recovery is owner-only and routes the raise to treasury.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/robinfun-high-pair-pollution-graduation-freeze.md`,
    tags: [SEC_TAG],
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-hoodcash",
    title: "HoodCash MiningPool — Burned Reward Accrual (Medium)",
    description:
      "An underfunded claim pays out only the pool balance but still marks the staker fully claimed, permanently burning the unpaid accrual even after the pool is refilled.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/reports/hoodcash-miningpool-medium.md`,
    tags: [SEC_TAG],
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-slvr",
    title: "SLVR — Delegate Claim Redirect (Medium)",
    description:
      "Lottery claim delegation grants recipient choice, not just claim rights, so an approved-but-hostile delegate can route a winner's ETH and SLVR to itself. Cross-checked against MultiClaim and AutoCommit V1/V2.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/slvr/reports/slvr-delegate-claim-redirect-medium.md`,
    tags: [SEC_TAG],
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-xstocks-oracle",
    title: "xStocks CdpEngine — Single-Reporter Oracle Trust (Trust/Centralization)",
    description:
      "The live CDP still reads EquityOracle V1 at quorum=1 with a single reporter equal to the owner, so one key defines collateral price for minting and liquidation. V2 enforces quorum 2 and a median.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/reports/xstocks-oracle-v1-trust.md`,
    tags: [SEC_TAG],
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-xstocks-fee",
    title: "xStocks CdpEngine — Unminted Borrow-Fee Debt (Medium, latent)",
    description:
      "Borrow fees are added to user debt but never minted as stable, so debt outgrows circulating supply. Dormant while borrowFeeBps is 0 on live engines; enabling fees activates it.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/reports/xstocks-cdp-fee-debt-latent.md`,
    tags: [SEC_TAG],
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-toolkit",
    title: "Web3 Bug-Hunt Toolkit",
    description:
      "Ten-step hunt pipeline in bash + Python: RPC ground-truth gate, creator trace and bundle grep for core discovery, surface map (codesize / Sourcify / selectors), unauthenticated call triage, Foundry fork-PoC scaffold, and report/disclosure generators, with a selftest harness.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/tree/main/scripts`,
    tags: [SEC_TAG],
    created_at: "2026-07-30T00:00:00Z",
  },
];

export const seedCollaborations: Collaboration[] = [
  {
    id: "seed-col-1",
    org: "Vercel",
    role: "Core Infrastructure Contributor",
    logo_url: null,
    link_url: null,
    sort_order: 0,
  },
  {
    id: "seed-col-2",
    org: "Stripe",
    role: "Payment Gateway Integration Consultant",
    logo_url: null,
    link_url: null,
    sort_order: 1,
  },
  {
    id: "seed-col-3",
    org: "Linear",
    role: "Frontend Performance Optimization",
    logo_url: null,
    link_url: null,
    sort_order: 2,
  },
  {
    id: "seed-col-4",
    org: "Open Source",
    role: "Maintainer of several high-traffic npm packages",
    logo_url: null,
    link_url: null,
    sort_order: 3,
  },
];

export const seedToolkitItems: ToolkitItem[] = [
  { id: "seed-tk-1", name: "Rust", icon_key: "rust", sort_order: 0 },
  { id: "seed-tk-2", name: "Solana", icon_key: "solana", sort_order: 1 },
  { id: "seed-tk-3", name: "Next.js", icon_key: "nextjs", sort_order: 2 },
  { id: "seed-tk-4", name: "TypeScript", icon_key: "typescript", sort_order: 3 },
  // PERN = Postgres, Express, React, Node (React covered here — not listed alone).
  { id: "seed-tk-5", name: "PERN Stack", icon_key: "pern", sort_order: 4 },
];

export const seedMotionProjects: MotionProject[] = [
  {
    id: "seed-motion-1",
    title: "Kinetic Type Reel",
    description:
      "A montage of kinetic typography sequences built for a product launch campaign.",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: null,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "seed-motion-2",
    title: "UI Choreography",
    description:
      "Micro-interaction studies exploring easing, staggering, and spatial continuity.",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: null,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "seed-motion-3",
    title: "Brand Ident",
    description:
      "A five-second animated identity system with a modular logo build sequence.",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: null,
    created_at: "2026-01-03T00:00:00Z",
  },
];

export const seedWriterPosts: WriterPost[] = [
  {
    id: "seed-writer-1",
    title: "On writing that converts and connects",
    slug: "writing-that-converts",
    date: "2026-06-01",
    excerpt:
      "The best copy disappears. It leaves only the reader and the decision in front of them.",
    body: `Good writing is not decoration laid over an idea. It is the shape the idea takes when it finally becomes clear.

## The reader is already busy

Every sentence competes with the impulse to leave. Respect that. Say the true thing first, then earn the second sentence with the first.

## Rhythm is meaning

Short sentences land. Longer ones, the kind that unspool a thought across several clauses before arriving, create the space a reader needs to feel rather than merely register. Alternate them.

> Write to be understood, not to be admired.

That is the whole craft, most days.`,
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "seed-writer-2",
    title: "Notes on the long-form rhythm",
    slug: "long-form-rhythm",
    date: "2026-05-12",
    excerpt:
      "A narrow column, a quiet palette, and one idea per paragraph. The rest is patience.",
    body: `A single column is a promise: I will not make you scan. Follow me down the page.

## One idea per paragraph

When a paragraph carries two ideas, the second one hides. Break it. Give each its own air.

## Endings

Stop when the argument is complete, not when the space runs out.`,
    created_at: "2026-05-12T00:00:00Z",
  },
];

// Hero tag pills per persona. Labels are tight synonyms of the real focus areas
// (see design prompt), styled to read as native to the site.
export const seedHeroTags: HeroTag[] = [
  { id: "seed-tag-secres", persona: "developer", label: "SecRes", slug: "security-research", sort_order: 0 },
  { id: "seed-tag-dev-solana", persona: "developer", label: "Solana", slug: "solana", sort_order: 1 },
  { id: "seed-tag-java", persona: "developer", label: "Java", slug: "java", sort_order: 2 },
  { id: "seed-tag-fullstack", persona: "developer", label: "Full-Stack", slug: "full-stack", sort_order: 3 },
  { id: "seed-tag-motion", persona: "motion", label: "Motion", slug: "motion-design", sort_order: 0 },
  { id: "seed-tag-tiktok", persona: "motion", label: "TikTok", slug: "tiktok", sort_order: 1 },
  { id: "seed-tag-youtube", persona: "motion", label: "YouTube", slug: "youtube", sort_order: 2 },
  { id: "seed-tag-uianim", persona: "motion", label: "UI Anim", slug: "ui-animation", sort_order: 3 },
  { id: "seed-tag-techwriting", persona: "writer", label: "Tech Writing", slug: "technical-writing", sort_order: 0 },
  { id: "seed-tag-casestudies", persona: "writer", label: "Case Studies", slug: "case-studies", sort_order: 1 },
  { id: "seed-tag-writer-solana", persona: "writer", label: "Solana", slug: "solana", sort_order: 2 },
];

// One showcase per tag slug. Real intro for Security Research (with real linked
// findings); clearly-labeled placeholders for the rest per the anti-hallucination
// rule — no invented projects.
export const seedTagShowcases: TagShowcase[] = [
  {
    id: "seed-show-secres",
    tag_slug: "security-research",
    intro_blurb:
      "Authorized Web3 / smart-contract security research — audits and bug-bounty work on launchpad, CDP and distribution protocols, mostly on Robinhood Chain (4663). Methodology is fork / eth_call / local-Foundry only; nothing is ever exploited on mainnet. Findings are severity-bounded honestly and disclosed privately until patched.",
    // Left empty on purpose: every finding carries the "security-research" tag,
    // so this showcase populates itself. Use project_ids only to pin an item.
    project_ids: [],
    resume_url: "/resume/security-research",
    created_at: "2026-07-21T00:00:00Z",
  },
  { id: "seed-show-solana", tag_slug: "solana", intro_blurb: "[Intro blurb for #Solana goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-java", tag_slug: "java", intro_blurb: "[Intro blurb for #Java goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-fullstack", tag_slug: "full-stack", intro_blurb: "[Intro blurb for #Full-Stack goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-motion", tag_slug: "motion-design", intro_blurb: "[Intro blurb for #Motion goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-tiktok", tag_slug: "tiktok", intro_blurb: "[Intro blurb for #TikTok goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-youtube", tag_slug: "youtube", intro_blurb: "[Intro blurb for #YouTube goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-uianim", tag_slug: "ui-animation", intro_blurb: "[Intro blurb for #UI-Animation goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-techwriting", tag_slug: "technical-writing", intro_blurb: "[Intro blurb for #Technical-Writing goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
  { id: "seed-show-casestudies", tag_slug: "case-studies", intro_blurb: "[Intro blurb for #Case-Studies goes here]", project_ids: [], created_at: "2026-01-01T00:00:00Z" },
];
