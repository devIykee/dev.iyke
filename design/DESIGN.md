---
name: Multi-Persona Portfolio System
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  h1: {}
  body: {}
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  motion_grid: 2-3 columns
  developer_grid: 12 columns (Bento)
  writer_grid: Single Column (Max 720px)
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is a high-utility, professional framework designed to showcase a multi-disciplinary portfolio. It prioritizes clarity and functional aesthetics over decorative flourishes, adhering to a **Strict Minimalism** philosophy. 

The system leverages three distinct visual personas—Motion, Developer, and Writer—to shift the emotional context of the content while maintaining a shared DNA of generous whitespace and structural integrity.

- **Motion Persona:** Energetic, clean, and clinical. Designed for high-impact visual storytelling.
- **Developer Persona:** Technical, precise, and systematic. Utilizes a "Bento" logic to organize complex information into clear containers.
- **Writer Persona:** Literary, quiet, and sophisticated. Focuses on legibility and the rhythm of the long-form word.

Across all personas, the UI avoids gradients, glows, and skeuomorphism, relying instead on stark color blocking and precise typography to guide the eye.

## Colors

The color palette is strictly partitioned by persona to ensure instant cognitive recognition of the current "mode."

- **Motion:** Uses a high-key off-white base with an aggressive Electric Blue accent. The blue is used sparingly for calls-to-action and active states to maintain a "gallery" feel.
- **Developer:** A deep-dark aesthetic using a near-black base. The Terminal Green accent provides high-contrast legibility for code snippets and technical metadata.
- **Writer:** A warm, cream-based palette that reduces eye strain for reading. The Deep Burgundy accent adds a touch of classical authority and weight to headings and dividers.

## Typography

Each persona adopts a specific typographic voice:
- **Inter (Motion):** A neutral, modern sans-serif that allows visual work to take center stage.
- **JetBrains Mono (Developer):** A technical monospace that emphasizes logic, structure, and the craft of code.
- **Playfair Display (Writer):** A high-contrast serif that evokes the feeling of editorial publishing and traditional typesetting.

**Hierarchy Rules:**
- Headlines in the Writer persona should use "Sentence case" to feel more personal.
- Headlines in the Developer persona should be consistently lowercase or prefixed with `>` or `#` to mimic terminal/markdown syntax.
- All personas use a shared 'Label' style for metadata (e.g., dates, tags) to maintain brand cohesion.

## Layout & Spacing

Layout logic shifts based on the content medium:

1.  **Motion (2-3 Column Grid):** Optimized for large-scale media. Projects are displayed in a rhythmic masonry or balanced grid to highlight visual variety.
2.  **Developer (12-Column Bento):** A modular system where elements occupy "tiles" of varying spans (e.g., 4x4, 8x4). This accommodates disparate data types like GitHub stats, tech stacks, and repo links in a single view.
3.  **Writer (Single Column):** A narrow, centered reading rail. This eliminates horizontal scanning fatigue and creates an intimate, focused environment for prose.

**Breakpoints:**
- **Mobile (<768px):** All layouts collapse to a single column with 16px horizontal margins. 
- **Tablet (768px - 1024px):** 2 columns for Motion/Developer; Writer remains centered.
- **Desktop (>1024px):** Full implementation of persona-specific grids.

## Elevation & Depth

This design system avoids shadows and Z-axis elevation. Depth is achieved purely through **Tonal Layering** and **Line Work**:

- **Borders:** Use 1px solid borders to define containers. In the Developer persona, borders are the primary separator (`#333`). In Motion and Writer, borders are used only for buttons and input fields.
- **Layering:** Backgrounds are flat. Content "elevates" via color contrast (e.g., a white card on a light gray background in Motion).
- **Separators:** Thin horizontal rules (1px) are used in the Writer persona to divide sections and chapters, maintaining a classic manuscript feel.

## Shapes

The design system uses **Soft** geometry to prevent the minimalism from feeling too sterile.

- **Standard Elements:** Buttons and cards use a 4px (0.25rem) radius.
- **Profile Photos:** 
    - **Motion/Writer:** Perfect circles to contrast with the rigid grid.
    - **Developer:** Rounded squares (8px) to align with the "Bento" tile aesthetic.
- **Project Screenshots:** Strict rectangles with 4px corner radii to mimic modern browser or device windows.

## Components

### Navigation
- **Floating Pill Navbar:** A bottom-center anchored container. It should be semi-opaque (`backdrop-filter: blur(8px)`) but strictly without shadows. In the Developer persona, it uses a solid `#1A1A1A` background with a green border.
- **Hamburger & Drawer:** A minimal two-line icon at the top-right. The drawer should slide in from the right, occupying 100% height and 300px width.

### Buttons
- **'Hire Me' (Filled):** Uses the persona’s accent color for the background and base color for text. No border.
- **'Resume' (Outline):** 1px border of the accent color. Transparent background.

### Collaborative List
- A two-column table-like structure. 
- **Left Column:** Organization (Bold).
- **Right Column:** Role (Regular/Muted).
- Each row is separated by a 1px hairline divider.

### Placeholders
- **Profile:** Labeled "IMG_PROFILE" in the Developer persona; blank circular frame in others.
- **Screenshots:** 16:9 or 4:3 aspect ratio containers with a subtle fill color one step removed from the base background.