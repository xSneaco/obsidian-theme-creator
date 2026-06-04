# Phase 1: Project Setup + Theme Data Layer

## Goal

Bootstrap the project with Vite + React + TypeScript + Tailwind CSS and implement all theme data logic (no UI yet). This phase produces the foundation every other phase builds on.

## Prerequisites

- Node.js installed
- Empty project directory

## Tasks

### 1.1 — Scaffold the Vite project

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite
```

Configure Tailwind in `vite.config.ts` and `src/index.css` (`@import "tailwindcss";`).

Verify the dev server starts and renders the default Vite template.

### 1.2 — Create `src/theme/color-utils.ts`

Implement from scratch (no external deps):

```typescript
hexToHsl(hex: string): { h: number; s: number; l: number }
hslToHex(h: number, s: number, l: number): string
lighten(hex: string, amount: number): string     // amount in percentage points
darken(hex: string, amount: number): string
withAlpha(hex: string, alpha: number): string     // returns hex8 format
hexToRgbString(hex: string): string               // "r, g, b"
isValidHex(value: string): boolean
getContrastRatio(hex1: string, hex2: string): number
```

All functions must handle both `#AABBCC` and `AABBCC` input formats. Normalize internally to `#xxxxxx`.

### 1.3 — Create `src/theme/sections.ts`

Define the `ThemeSection` interface and export a `SECTIONS` constant array with all 20 sections from the plan:

```typescript
interface ThemeSection {
  id: string;
  label: string;
  description: string;
  group: SectionGroup;
  cssVariables: string[];
  defaultDark: string;
  defaultLight: string;
  previewSelector: string;
}

type SectionGroup = 'backgrounds' | 'text' | 'ui-elements' | 'syntax';
```

**Backgrounds group (5 sections):**
- `bg-primary` — Editor Background — `--background-primary` — dark: `#1e1e1e` / light: `#ffffff`
- `bg-secondary` — Sidebar Background — `--background-secondary`, `--background-secondary-alt` — dark: `#202020` / light: `#f2f3f5`
- `bg-tertiary` — Titlebar / Tab Bar — `--titlebar-background`, `--titlebar-background-focused` — dark: `#191919` / light: `#e9e9e9`
- `bg-codeblock` — Code Block Background — `--code-background` — dark: `#2b2b2b` / light: `#f4f4f4`
- `bg-tag` — Tag Background — `--tag-background` — dark: `#ffffff1a` / light: `#0000000d`

**Text group (6 sections):**
- `text-normal` — Normal Text — `--text-normal` — dark: `#dcddde` / light: `#2e3338`
- `text-muted` — Muted / Secondary Text — `--text-muted`, `--text-faint` — dark: `#999999` / light: `#888888`
- `text-accent` — Links / Accent Text — `--text-accent`, `--text-accent-hover` — dark: `#7f6df2` / light: `#705dcf`
- `text-on-accent` — Text on Accent Color — `--text-on-accent` — dark: `#ffffff` / light: `#ffffff`
- `text-heading` — Heading Color — `--h1-color` through `--h6-color` — dark: `#dcddde` / light: `#2e3338`
- `text-inline-code` — Inline Code — `--code-normal` — dark: `#e06c75` / light: `#c7254e`

**UI Elements group (5 sections):**
- `interactive-accent` — Interactive Accent — `--interactive-accent`, `--interactive-accent-hover` — dark: `#7f6df2` / light: `#705dcf`
- `border-color` — Borders / Dividers — `--background-modifier-border`, `--background-modifier-border-hover` — dark: `#333333` / light: `#dcdcdc`
- `scrollbar` — Scrollbar Thumb — `--scrollbar-thumb-bg` — dark: `#ffffff33` / light: `#00000033`
- `selection` — Text Selection Highlight — `--text-selection` — dark: `#7f6df233` / light: `#705dcf33`
- `search-highlight` — Search Match Highlight — `--text-highlight-bg` — dark: `#ffd40080` / light: `#ffd40080`

**Syntax group (4 sections):**
- `bold-color` — Bold Text — `--bold-color` — dark: `#dcddde` / light: `#2e3338`
- `italic-color` — Italic Text — `--italic-color` — dark: `#dcddde` / light: `#2e3338`
- `tag-text` — Tag Text Color — `--tag-color` — dark: `#7f6df2` / light: `#705dcf`
- `list-marker` — List Marker / Bullet — `--list-marker-color` — dark: `#7f6df2` / light: `#705dcf`

### 1.4 — Create `src/theme/defaults.ts`

Export helper functions that build default color maps from the SECTIONS array:

```typescript
function getDefaultColors(mode: 'dark' | 'light'): Record<string, string>
```

### 1.5 — Create `src/theme/derive.ts`

One derivation function per section. Each takes a hex value and returns a `Record<string, string>` of all CSS variables that section controls (both direct and derived).

Derivation rules:

| Section | Derived Variables |
|---|---|
| `bg-primary` | `--background-primary` (direct), `--background-primary-alt` (lighten 5%), `--background-modifier-form-field` (darken 4%), `--background-modifier-hover` (lighten 8%) |
| `bg-secondary` | `--background-secondary` (direct), `--background-secondary-alt` (lighten 3%) |
| `bg-tertiary` | `--titlebar-background` (direct), `--titlebar-background-focused` (lighten 3%) |
| `bg-codeblock` | `--code-background` (direct) |
| `bg-tag` | `--tag-background` (direct) |
| `text-normal` | `--text-normal` (direct) |
| `text-muted` | `--text-muted` (direct), `--text-faint` (darken 15%) |
| `text-accent` | `--text-accent` (direct), `--text-accent-hover` (lighten 10%) |
| `text-on-accent` | `--text-on-accent` (direct) |
| `text-heading` | `--h1-color` through `--h6-color` (all same value) |
| `text-inline-code` | `--code-normal` (direct) |
| `interactive-accent` | `--interactive-accent` (direct), `--interactive-accent-hover` (lighten 10%), `--interactive-accent-rgb` (RGB triplet string) |
| `border-color` | `--background-modifier-border` (direct), `--background-modifier-border-hover` (lighten 10%) |
| `scrollbar` | `--scrollbar-thumb-bg` (direct) |
| `selection` | `--text-selection` (direct) |
| `search-highlight` | `--text-highlight-bg` (direct) |
| `bold-color` | `--bold-color` (direct) |
| `italic-color` | `--italic-color` (direct) |
| `tag-text` | `--tag-color` (direct) |
| `list-marker` | `--list-marker-color` (direct) |

Export a top-level function:

```typescript
function deriveSection(sectionId: string, hex: string): Record<string, string>
```

### 1.6 — Create `src/theme/export.ts`

```typescript
function generateThemeCSS(
  sections: ThemeSection[],
  colors: Record<string, string>,
  mode: 'dark' | 'light' | 'both',
  themeName: string
): string
```

For each section, look up the user's hex in `colors`, call `deriveSection()` to expand into the full variable set, and concatenate inside `body.theme-dark { }` and/or `body.theme-light { }`. Add a comment header with the theme name.

Output format:

```css
/* ThemeName — generated by Obsidian Theme Creator */

body.theme-dark {
  --background-primary: #1e1e1e;
  --background-primary-alt: #232323;
  /* ... */
}
```

## Deliverables

After this phase, the project should:

- Build and run with `npm run dev` (showing default Vite page is fine)
- Have all theme data modules importable and functional
- Have zero UI components beyond the Vite default — those come in later phases

## File Structure After Phase 1

```
src/
├── App.tsx                  (default Vite template, untouched)
├── main.tsx                 (default Vite entry)
├── index.css                (Tailwind imports)
├── theme/
│   ├── sections.ts
│   ├── defaults.ts
│   ├── derive.ts
│   ├── export.ts
│   └── color-utils.ts
```
