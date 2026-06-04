# Obsidian Theme Creator — Implementation Plan

## Project Overview

A single-page web app that lets users visually create Obsidian themes. A live Obsidian-like mock preview sits on the left; a color configuration panel sits on the right. Users click regions in the preview (or pick from the panel), enter hex codes, see changes live, and export a valid `theme.css` that Obsidian can load directly from its `.obsidian/themes/<ThemeName>/` folder.

**Stack:** Vite + React + TypeScript + Tailwind CSS. No backend. No routing. Everything runs client-side.

---

## Obsidian Theme System Context

Obsidian themes are plain CSS files that override CSS custom properties. They scope to `body.theme-dark` and/or `body.theme-light`. There are 100+ variables, but roughly 20–25 control the visual identity. The rest derive from those or are rarely noticed.

This tool should expose only the impactful variables and compute the rest automatically via HSL derivations (lighten, darken, alpha adjustments).

---

## Data Model

### `ThemeSection` — the core abstraction

Each "section" the user can configure maps to one or more actual Obsidian CSS variables:

```typescript
interface ThemeSection {
  id: string;
  label: string;            // e.g. "Editor Background"
  description: string;      // tooltip/helper text
  group: SectionGroup;      // for panel organization
  cssVariables: string[];   // actual Obsidian CSS vars this controls
  defaultDark: string;      // default hex for dark mode
  defaultLight: string;     // default hex for light mode
  previewSelector: string;  // CSS selector in the mock preview that this section targets
}

type SectionGroup = 'backgrounds' | 'text' | 'ui-elements' | 'syntax';
```

### Sections to Expose

Define these in a `src/theme/sections.ts` file as a `SECTIONS` constant array:

**Backgrounds group:**

| id | label | cssVariables | defaultDark | defaultLight |
|---|---|---|---|---|
| `bg-primary` | Editor Background | `--background-primary` | `#1e1e1e` | `#ffffff` |
| `bg-secondary` | Sidebar Background | `--background-secondary`, `--background-secondary-alt` | `#202020` | `#f2f3f5` |
| `bg-tertiary` | Titlebar / Tab Bar | `--titlebar-background`, `--titlebar-background-focused` | `#191919` | `#e9e9e9` |
| `bg-codeblock` | Code Block Background | `--code-background` | `#2b2b2b` | `#f4f4f4` |
| `bg-tag` | Tag Background | `--tag-background` | `#ffffff1a` | `#0000000d` |

**Text group:**

| id | label | cssVariables | defaultDark | defaultLight |
|---|---|---|---|---|
| `text-normal` | Normal Text | `--text-normal` | `#dcddde` | `#2e3338` |
| `text-muted` | Muted / Secondary Text | `--text-muted`, `--text-faint` | `#999999` | `#888888` |
| `text-accent` | Links / Accent Text | `--text-accent`, `--text-accent-hover` | `#7f6df2` | `#705dcf` |
| `text-on-accent` | Text on Accent Color | `--text-on-accent` | `#ffffff` | `#ffffff` |
| `text-heading` | Heading Color | `--h1-color`, `--h2-color`, `--h3-color`, `--h4-color`, `--h5-color`, `--h6-color` | `#dcddde` | `#2e3338` |
| `text-inline-code` | Inline Code | `--code-normal` | `#e06c75` | `#c7254e` |

**UI Elements group:**

| id | label | cssVariables | defaultDark | defaultLight |
|---|---|---|---|---|
| `interactive-accent` | Interactive Accent | `--interactive-accent`, `--interactive-accent-hover` | `#7f6df2` | `#705dcf` |
| `border-color` | Borders / Dividers | `--background-modifier-border`, `--background-modifier-border-hover` | `#333333` | `#dcdcdc` |
| `scrollbar` | Scrollbar Thumb | `--scrollbar-thumb-bg` | `#ffffff33` | `#00000033` |
| `selection` | Text Selection Highlight | `--text-selection` | `#7f6df233` | `#705dcf33` |
| `search-highlight` | Search Match Highlight | `--text-highlight-bg` | `#ffd40080` | `#ffd40080` |

**Syntax group (collapsed by default, advanced):**

| id | label | cssVariables | defaultDark | defaultLight |
|---|---|---|---|---|
| `bold-color` | Bold Text | `--bold-color` | `#dcddde` | `#2e3338` |
| `italic-color` | Italic Text | `--italic-color` | `#dcddde` | `#2e3338` |
| `tag-text` | Tag Text Color | `--tag-color` | `#7f6df2` | `#705dcf` |
| `list-marker` | List Marker / Bullet | `--list-marker-color` | `#7f6df2` | `#705dcf` |

### Derived Variables

Many Obsidian variables are slight modifications of a core color. Never expose these — compute them automatically. Create a `src/theme/derive.ts` module:

```typescript
// For each section, derive related variables automatically.
// Example for bg-primary:
function deriveBgPrimary(hex: string): Record<string, string> {
  return {
    '--background-primary': hex,
    '--background-primary-alt': lighten(hex, 5),
    '--background-modifier-form-field': darken(hex, 4),
    '--background-modifier-hover': lighten(hex, 8),
  };
}

// Example for interactive-accent:
function deriveAccent(hex: string): Record<string, string> {
  return {
    '--interactive-accent': hex,
    '--interactive-accent-hover': lighten(hex, 10),
    '--interactive-accent-rgb': hexToRgbString(hex), // some Obsidian vars use RGB triplets
  };
}
```

Each section has its own derivation function. The export logic calls all of them to produce the full set of CSS variables.

---

## Color Utilities

Create `src/theme/color-utils.ts`. No external dependency needed — implement from scratch (~50 lines):

```typescript
// Required functions:
hexToHsl(hex: string): { h: number; s: number; l: number }
hslToHex(h: number, s: number, l: number): string
lighten(hex: string, amount: number): string     // amount in percentage points
darken(hex: string, amount: number): string
withAlpha(hex: string, alpha: number): string     // returns rgba() or hex8
hexToRgbString(hex: string): string               // "r, g, b" for Obsidian RGB vars
isValidHex(value: string): boolean                // validate user input
getContrastRatio(hex1: string, hex2: string): number  // for optional WCAG checking
```

---

## App State

### Reducer-based state at the ThemeProvider level

```typescript
interface ThemeState {
  themeName: string;
  mode: 'dark' | 'light';
  colors: Record<string, string>;  // section.id -> hex value
  history: ThemeState[];            // past states for undo
  future: ThemeState[];             // for redo
  activeSection: string | null;     // currently selected section id
}

type ThemeAction =
  | { type: 'SET_COLOR'; sectionId: string; hex: string }
  | { type: 'SET_MODE'; mode: 'dark' | 'light' }
  | { type: 'SET_THEME_NAME'; name: string }
  | { type: 'SET_ACTIVE_SECTION'; sectionId: string | null }
  | { type: 'LOAD_PRESET'; colors: Record<string, string> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };
```

Wrap the reducer in a React context (`ThemeProvider`) and expose a `useTheme()` hook.

### Persistence

On every state change, debounce-write the current `colors`, `mode`, and `themeName` to `localStorage`. On mount, read from `localStorage` if present; otherwise use the defaults for the current mode.

---

## Component Architecture

```
App
├── ThemeProvider               (context + useReducer, wraps everything)
├── Header                      (theme name input, dark/light toggle, undo/redo, export button)
├── main content (horizontal split, resizable)
│   ├── PreviewPane             (the fake Obsidian UI)
│   │   ├── MockTitleBar        (three macOS dots, vault name, window controls)
│   │   ├── MockLeftSidebar     (search box, folder tree, bottom icons)
│   │   ├── MockEditor          (tabs bar + markdown content area)
│   │   │   ├── TabBar          (2-3 tabs, one active)
│   │   │   └── EditorContent   (static rendered markdown-like content)
│   │   └── MockRightSidebar    (outline panel, backlinks section)
│   └── ConfigPanel             (scrollable list of all color inputs)
│       ├── SectionGroup("Backgrounds")
│       ├── SectionGroup("Text")
│       ├── SectionGroup("UI Elements")
│       └── SectionGroup("Syntax")   (collapsed by default)
└── ExportModal                 (CSS preview, copy button, download button)
```

---

## Component Specifications

### `Header`

A horizontal bar at the top of the page containing:

1. **Theme name input** — text field, placeholder "My Theme", bound to `themeName` state
2. **Mode toggle** — segmented control or toggle switch, "Dark" / "Light", switches the `mode` state and loads corresponding defaults for any section that hasn't been customized
3. **Undo / Redo buttons** — disabled when history/future is empty
4. **Export button** — opens the ExportModal

### `PreviewPane`

The heart of the app. This is a scaled-down mock of the Obsidian interface. All styling on this component is driven entirely by CSS custom properties applied to a wrapper `<div>` via its `style` attribute. When the user changes a color, only the CSS variable value changes — no React re-render of the preview structure is needed.

**Click-to-edit interaction:**

Each visual region of the preview has a transparent overlay `<div>` positioned on top of it. These overlays:
- Show a dashed outline + section name tooltip on hover
- On click, set `activeSection` to the corresponding section ID, which scrolls the ConfigPanel to that section and focuses its hex input
- Use `pointer-events: auto` on the overlay, `pointer-events: none` on the content beneath

**Mock content to include in the editor area (hardcoded, not parsed):**

```
# Welcome to My Vault
## Getting Started

This is a sample note demonstrating your theme. You can see how **bold text**
and *italic text* appear, along with [[Internal Link]] references and
[external links](https://example.com).

Here's some `inline code` in a sentence.

> This is a blockquote that might contain useful information.

- First bullet point
- Second bullet point
- Third with a #sample-tag

​```python
def hello():
    print("Hello, Obsidian!")
​```
```

This content exercises every text style a theme touches: headings, bold, italic, links (internal and external), inline code, code blocks, blockquotes, list markers, and tags.

### `MockLeftSidebar`

Contains:
- A search input (non-functional, just styled)
- A folder tree with 3-4 folders, some expanded to show `.md` files. Suggested structure:
  - 📁 Daily Notes (expanded) → `2024-01-15.md`, `2024-01-16.md`
  - 📁 Projects (collapsed)
  - 📁 References (expanded) → `Reading List.md`, `Templates.md`
  - `README.md` (root file)
- Bottom icons row (settings gear, help question mark)

File list items should highlight on hover using the `interactive-accent` color.

### `MockRightSidebar`

Contains:
- **Outline panel** — a list of headings extracted from the mock editor content (H1: "Welcome to My Vault", H2: "Getting Started")
- **Backlinks panel** — 2-3 fake backlink entries like "Projects/Project Alpha.md" with a snippet line

### `ConfigPanel`

A scrollable vertical panel. Sections are organized into collapsible groups (`SectionGroup` component). Each section renders as a `ColorInput` row.

**`SectionGroup` component:**
- Group header (e.g. "Backgrounds") with a collapse/expand toggle
- The "Syntax" group starts collapsed
- Contains a list of `ColorInput` components

**`ColorInput` component:**
- A colored swatch (square, ~32px) that is actually a styled `<input type="color">` (the native picker hides behind the swatch)
- A text input for hex values with validation (shows red border on invalid input, debounce 300ms before applying)
- The section label text
- A small reset button (circular arrow icon) to revert to the default for the current mode
- When this section is the `activeSection`, the row gets a highlight background and the hex input is focused
- The row should have `id={section.id}` or a `data-section` attribute so the preview click handler can `scrollIntoView()` to it

### `ExportModal`

Triggered by the Export button. Contains:

1. **Mode selector for export** — radio buttons: "Dark only", "Light only", "Both" (if "both", the user should have configured colors for both modes; warn if only one mode was edited)
2. **CSS preview** — a `<pre>` block with syntax highlighting showing the generated CSS. Use a simple regex-based highlighter (color the variable names, colons, and values) — no need for a library.
3. **Copy to Clipboard button** — uses `navigator.clipboard.writeText()`
4. **Download button** — generates a `Blob` with `text/css` MIME type, creates a download link via `URL.createObjectURL()`, names the file `theme.css`
5. **Install instructions** — a small collapsible section: "Place this file at `.obsidian/themes/<ThemeName>/theme.css` and select it in Settings → Appearance → Themes."

---

## Export Logic

Create `src/theme/export.ts`:

```typescript
function generateThemeCSS(
  sections: ThemeSection[],
  colors: Record<string, string>,
  mode: 'dark' | 'light' | 'both',
  themeName: string
): string
```

For each section, look up the user's chosen hex in `colors`, then call that section's derivation function to expand into the full set of CSS variables. Concatenate all variables inside the appropriate `body.theme-dark { }` or `body.theme-light { }` block.

Output format:

```css
/* ThemeName — generated by Obsidian Theme Creator */

body.theme-dark {
  --background-primary: #1e1e1e;
  --background-primary-alt: #232323;
  /* ... all derived variables ... */
}
```

If `mode === 'both'`, output both blocks. Add a comment header with the theme name.

---

## Interaction Flows

### Flow 1: Click on Preview Region

1. User hovers over the editor background area in PreviewPane
2. Overlay shows dashed border + tooltip "Editor Background"
3. User clicks
4. `activeSection` is set to `bg-primary`
5. ConfigPanel scrolls to the `bg-primary` row, row highlights, hex input focuses
6. User types a hex code or clicks the swatch to open native picker
7. `SET_COLOR` action dispatches, CSS variable on the preview wrapper updates immediately
8. Preview reflects the change in real time

### Flow 2: Edit via Config Panel Directly

1. User scrolls the ConfigPanel to "Interactive Accent" under UI Elements
2. Clicks the color swatch → native color picker opens
3. Picks a color → `SET_COLOR` dispatches
4. Preview updates immediately (buttons, active file highlight, links all change)

### Flow 3: Export

1. User clicks "Export" in the Header
2. ExportModal opens with CSS preview
3. User selects "Dark only", clicks Download
4. Browser downloads `theme.css`
5. User places it in their Obsidian vault's themes folder

---

## File Structure

```
src/
├── App.tsx                         # Root layout: Header + split pane + modal
├── main.tsx                        # Vite entry, mounts App
├── index.css                       # Tailwind imports + any global styles
├── theme/
│   ├── sections.ts                 # SECTIONS constant array with all ThemeSection definitions
│   ├── defaults.ts                 # Default color maps for dark and light modes
│   ├── derive.ts                   # Derivation functions per section
│   ├── export.ts                   # generateThemeCSS() function
│   └── color-utils.ts              # hexToHsl, hslToHex, lighten, darken, withAlpha, etc.
├── context/
│   ├── ThemeProvider.tsx            # React context + useReducer + localStorage persistence
│   └── useTheme.ts                 # useContext hook consumer
├── components/
│   ├── Header.tsx                  # Theme name, mode toggle, undo/redo, export
│   ├── preview/
│   │   ├── PreviewPane.tsx         # Wrapper that applies CSS vars to style attr
│   │   ├── MockTitleBar.tsx        # macOS-style title bar
│   │   ├── MockLeftSidebar.tsx     # File tree
│   │   ├── MockEditor.tsx          # Tabs + editor content
│   │   ├── MockRightSidebar.tsx    # Outline + backlinks
│   │   └── ClickOverlay.tsx        # Transparent hover/click regions
│   ├── config/
│   │   ├── ConfigPanel.tsx         # Scrollable section list
│   │   ├── SectionGroup.tsx        # Collapsible group header + children
│   │   └── ColorInput.tsx          # Swatch + hex input + label + reset
│   └── ExportModal.tsx             # CSS preview + copy + download
└── hooks/
    └── useUndoRedo.ts              # History stack logic (if extracted from reducer)
```

---

## Styling Approach

- **App chrome** (header, config panel, modal, layout) — use Tailwind utility classes. Dark background for the app itself so the preview pane stands out.
- **Preview pane** — NO Tailwind on the mock Obsidian elements. Style them purely with CSS custom properties applied via a `style` attribute on the preview wrapper div. This mirrors how Obsidian actually works and ensures the preview is an accurate representation of what the theme will look like. Write these styles in a dedicated `preview.css` file or as a `<style>` block within PreviewPane.
- **Responsive behavior** — at narrow widths (<768px), stack the preview above and config below. At desktop widths, side-by-side split.

---

## Key Implementation Details

### Live Preview via CSS Variables

The preview wrapper div should apply all computed CSS variables as inline styles:

```tsx
const previewStyle = useMemo(() => {
  const vars: Record<string, string> = {};
  for (const section of SECTIONS) {
    const hex = colors[section.id];
    const derived = deriveSection(section.id, hex);
    Object.assign(vars, derived);
  }
  return vars;
}, [colors]);

return <div className="preview-wrapper" style={previewStyle}>...</div>;
```

All elements inside the preview reference these variables in their CSS (e.g., `background: var(--background-primary)`). Changing state only updates the inline style object — the DOM structure stays the same.

### Click Overlay Implementation

Each overlay region is an absolutely-positioned `<div>` covering a visual area of the preview. Map section IDs to regions:

```typescript
const OVERLAY_REGIONS: { sectionId: string; area: 'titlebar' | 'left-sidebar' | 'editor' | 'right-sidebar' | 'editor-codeblock' | 'editor-tabs' }[] = [
  { sectionId: 'bg-primary', area: 'editor' },
  { sectionId: 'bg-secondary', area: 'left-sidebar' },
  { sectionId: 'bg-secondary', area: 'right-sidebar' },
  { sectionId: 'bg-tertiary', area: 'titlebar' },
  // etc.
];
```

For text colors, the overlay targets the text elements directly (headings, links, code spans). These overlays are smaller and positioned over specific text runs.

### Hex Input Validation

Accept with or without `#`. Validate against `/^#?[0-9a-fA-F]{6}$/`. Normalize to `#xxxxxx` before storing. Show a red border and don't dispatch `SET_COLOR` while invalid. Debounce typed input by 300ms; native color picker changes apply immediately.

### Undo/Redo

Before each `SET_COLOR` action, push the current `colors` map onto the `history` stack and clear `future`. On `UNDO`, pop from `history` to restore and push current onto `future`. Cap history at 50 entries.

---

## Obsidian CSS Variable Reference

These are the actual Obsidian variable names the export must produce. Grouped by the section that controls them:

```
--background-primary            ← bg-primary
--background-primary-alt        ← derived from bg-primary (lighten 5%)
--background-secondary          ← bg-secondary
--background-secondary-alt      ← derived from bg-secondary (lighten 3%)
--background-modifier-border    ← border-color
--background-modifier-border-hover ← derived from border-color (lighten 10%)
--background-modifier-form-field ← derived from bg-primary (darken 4%)
--background-modifier-hover     ← derived from bg-primary (lighten 8%)
--titlebar-background           ← bg-tertiary
--titlebar-background-focused   ← derived from bg-tertiary (lighten 3%)
--code-background               ← bg-codeblock
--tag-background                ← bg-tag
--text-normal                   ← text-normal
--text-muted                    ← text-muted
--text-faint                    ← derived from text-muted (darken 15%)
--text-accent                   ← text-accent
--text-accent-hover             ← derived from text-accent (lighten 10%)
--text-on-accent                ← text-on-accent
--h1-color through --h6-color   ← text-heading (single value for all, or per-level in v2)
--code-normal                   ← text-inline-code
--interactive-accent            ← interactive-accent
--interactive-accent-hover      ← derived from interactive-accent (lighten 10%)
--interactive-accent-rgb        ← derived from interactive-accent (RGB triplet string)
--scrollbar-thumb-bg            ← scrollbar
--text-selection                ← selection
--text-highlight-bg             ← search-highlight
--bold-color                    ← bold-color
--italic-color                  ← italic-color
--tag-color                     ← tag-text
--list-marker-color             ← list-marker
```

---

## Testing Checklist

Before considering the implementation complete, verify:

- [ ] Changing every section color updates the preview in real time
- [ ] Clicking a preview region scrolls to and focuses the correct config entry
- [ ] Dark/Light mode toggle swaps all colors to the appropriate defaults (only for sections the user hasn't customized in that mode)
- [ ] Undo/Redo works correctly across multiple color changes
- [ ] Hex input accepts `#AABBCC` and `AABBCC`, rejects invalid input, shows validation state
- [ ] Native color picker (swatch click) works and syncs with hex input
- [ ] Export generates valid CSS with correct `body.theme-dark` / `body.theme-light` scoping
- [ ] Exported CSS can be placed in Obsidian's themes folder and loads correctly
- [ ] Copy to clipboard works
- [ ] Download produces a `theme.css` file
- [ ] State persists across page refresh via localStorage
- [ ] Layout is usable on screens ≥1024px wide, and stacked on smaller screens
- [ ] Reset button on each color input reverts to the mode's default