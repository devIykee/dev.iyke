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
  // Security findings from the security-research workspace. Tagged so
  // /security-research picks them up; the tag also keeps them off the
  // engineering pages.
  {
    id: "seed-dev-sec-openfair",
    title: "Openfair: pool squat on V3 graduation",
    description:
      "Launches were seeded through createAndInitializePoolIfNecessary with no check on the price that came back. Anyone could open the pool first at a price of their choosing and the raise would land in it. Reported privately. Openfair shipped v2.0 and covered the launches that had already gone out. No funds were lost.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/openfair-high-v3-migration-pool-squat.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-theindex",
    title: "The Index: payout snapshot can be flash loaned",
    description:
      "Distribution weights came from a live balanceOf read at a moment anyone could trigger. No checkpoint, no minimum hold. Borrow INDEX, get counted, hand it back, still collect the payout. Reproduced with a local Foundry test built from the deployed snapshot and distribute logic.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/theindex-high-flash-inflated-snapshot.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-21T00:00:00Z",
  },
  {
    id: "seed-dev-sec-merrymen",
    title: "Merry Men: pre initialised V4 pool bricks the factory",
    description:
      "initializePool returns rather than reverting when the pool already exists, and the factory never read the return value. Open the pool for the factory's next CREATE address and createToken fails during settlement. The revert rolls the nonce back, so every retry predicts the same address. Confirmed on an Anvil fork.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/merrymen-high-v4-preinit-factory-freeze.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-stockdotfun",
    title: "StockDotFun: pre initialised V4 pool freezes graduation",
    description:
      "The locker calls initialize directly, which reverts if the pool key is taken. Claiming that key costs gas and no tokens. Graduation then fails for good, curve trading is already off, and roughly 4.4 ETH of raise has nowhere to go. The verified source has no owner recovery path.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/stockdotfun-high-v4-preinit-graduation-freeze.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-hoodrich",
    title: "HoodRich: no slippage bounds on V2 migration",
    description:
      "addLiquidityETH ran with amountTokenMin and amountETHMin both at 0, so a pre skewed pair takes the raise at whatever ratio it holds. Found by comparison: the same codebase's meme factory already checked slot0, and a competing pad used 95 percent bounds on the identical call.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/hoodrich-high-v2-zero-min-migration.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-robinlaunch",
    title: "Robinlaunch: pool squat on V3 migration",
    description:
      "Same shape as the Openfair bug on a different pad. Graduation and Direct Pool both deposit into whatever pool exists, at whatever price it holds. Bound is one launch, about 2.5 ETH. Covered by a Foundry test mirroring the call sequence.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/robinlaunch-high-v3-migration-pool-squat.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-robinfun",
    title: "Robinfun: dust on the pair blocks graduation",
    description:
      "Curve selling stops once the target is hit and graduate is the only way forward. Around 0.000003 ETH of WETH sitting on the pair trips the pollution check and graduate reverts. Buyers cannot exit until the owner runs a recovery that sends the raise to treasury.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/reports/robinfun-high-pair-pollution-graduation-freeze.md`,
    tags: [SEC_TAG],
    severity: "High",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "seed-dev-sec-hoodcash",
    title: "HoodCash: short claims burn the rest of the accrual",
    description:
      "When the pool holds less than a staker has accrued, the claim pays out what is there and still advances the claimed marker. The shortfall is gone, and refilling the pool does not bring it back. Any staker sets this off on their own rewards.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/reports/hoodcash-miningpool-medium.md`,
    tags: [SEC_TAG],
    severity: "Medium",
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-slvr",
    title: "SLVR: claim delegates pick the recipient",
    description:
      "approveDelegate lets a delegate choose where the ETH and SLVR go, not just trigger the claim. The official helpers hardcode safe recipients, so this only bites with a hostile or stolen delegate key. The project's own MultiClaim source flags the same problem.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/slvr/reports/slvr-delegate-claim-redirect-medium.md`,
    tags: [SEC_TAG],
    severity: "Medium",
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-xstocks-fee",
    title: "xStocks: borrow fee debt is never minted",
    description:
      "The fee is added to a user's debt but no stable is minted against it, so debt drifts past circulating supply. borrowFeeBps reads 0 on every engine I checked, so nothing is broken today. Turning fees on without changing the accounting starts the drift.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/reports/xstocks-cdp-fee-debt-latent.md`,
    tags: [SEC_TAG],
    severity: "Medium",
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-xstocks-oracle",
    title: "xStocks: one key sets the oracle price",
    description:
      "The engine holding live TVL still reads EquityOracle V1 at quorum 1, and its single reporter is the owner address. That key decides mint limits and liquidation prices. Their own V2 oracle requires quorum 2 and a median, so the fix is already written.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/blob/main/sessions/2026-08-03/reports/xstocks-oracle-v1-trust.md`,
    tags: [SEC_TAG],
    severity: "Trust",
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: "seed-dev-sec-toolkit",
    title: "Bug hunt toolkit",
    description:
      "Ten scripts covering the repeatable parts of a hunt: RPC and chain id check, creator trace, frontend bundle grep, surface map with Sourcify and a selector dump, unauthenticated call triage, Foundry fork scaffold, and the report and disclosure templates. Each one exits on a gate so a dead target gets dropped early.",
    screenshot_url: null,
    link: `${SECURITY_REPO}/tree/main/scripts`,
    tags: [SEC_TAG],
    severity: "Tooling",
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
// rule. Nothing invented.
export const seedTagShowcases: TagShowcase[] = [
  {
    id: "seed-show-secres",
    tag_slug: "security-research",
    intro_blurb:
      "I audit EVM protocols, mostly launchpads and CDP engines on Robinhood Chain. Eleven bugs reported so far, seven of them High. Everything is verified on a fork or with a local Foundry test, never against live state, and reported privately before it goes anywhere else.",
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
