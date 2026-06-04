# Phase 3: Preview Pane

## Goal

Build the mock Obsidian UI preview that is styled entirely via CSS custom properties. This is the visual centerpiece of the app — it must look like a convincing miniature of Obsidian and react instantly to color changes.

## Prerequisites

- Phase 1 complete (theme data layer)
- Phase 2 complete (ThemeProvider + useTheme hook)

## Tasks

### 3.1 — Create `src/components/preview/PreviewPane.tsx`

The wrapper component that:

1. Reads `colors` from `useTheme()`
2. Computes all CSS variables using `deriveSection()` for every section
3. Applies them as inline `style` on a wrapper `<div>`
4. Renders the mock Obsidian layout inside

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

The preview layout is a CSS Grid or Flexbox arrangement:

```
┌─────────────────────────────────────────┐
│              MockTitleBar                │
├──────────┬──────────────────┬───────────┤
│  Left    │   MockEditor     │  Right    │
│ Sidebar  │  (Tabs + Body)   │ Sidebar   │
│          │                  │           │
└──────────┴──────────────────┴───────────┘
```

### 3.2 — Create `src/components/preview/preview.css`

A dedicated CSS file for preview styling. **No Tailwind here** — all styles use CSS custom properties to mirror how Obsidian actually works.

Example rules:

```css
.preview-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

.preview-editor {
  background: var(--background-primary);
  color: var(--text-normal);
}

.preview-sidebar {
  background: var(--background-secondary);
  color: var(--text-normal);
  border-right: 1px solid var(--background-modifier-border);
}
```

Every color reference must use `var(--obsidian-variable-name)`.

### 3.3 — Create `src/components/preview/MockTitleBar.tsx`

A macOS-style title bar containing:
- Three colored dots (close/minimize/maximize — purely decorative)
- Vault name text (e.g., "My Vault")
- Minimal window control icons on the right (optional)

Styled with `--titlebar-background` and `--titlebar-background-focused`.

### 3.4 — Create `src/components/preview/MockLeftSidebar.tsx`

Contains:
- A search input (non-functional, just styled) with placeholder "Search..."
- A folder tree:
  - `📁 Daily Notes` (expanded) → `2024-01-15.md`, `2024-01-16.md`
  - `📁 Projects` (collapsed)
  - `📁 References` (expanded) → `Reading List.md`, `Templates.md`
  - `README.md` (root file)
- Bottom icons row (settings gear, help icon)

File list items highlight on hover using `--interactive-accent`. The active file (e.g., `README.md`) should show with accent background.

Use `--background-secondary` for the sidebar background, `--text-normal` for file names, `--text-muted` for secondary text.

### 3.5 — Create `src/components/preview/MockEditor.tsx`

Two sub-sections:

**TabBar:** 2-3 tabs at the top. One is active (shows `--background-primary` bg), others show `--background-secondary`. Tab text uses `--text-normal` / `--text-muted`. Tabs: "README.md" (active), "Daily Notes.md", "Project Alpha.md".

**EditorContent:** Hardcoded rendered markdown content (NOT raw markdown — render as styled HTML):

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

```python
def hello():
    print("Hello, Obsidian!")
```
```

Style mappings:
- `<h1>`, `<h2>` → `color: var(--h1-color)` / `var(--h2-color)`
- `<strong>` → `color: var(--bold-color)`
- `<em>` → `color: var(--italic-color)`
- `[[Internal Link]]` → `color: var(--text-accent)` with special styling to look like a wiki-link
- `[external links]` → `color: var(--text-accent)` with underline
- `` `inline code` `` → `color: var(--code-normal); background: var(--code-background)`
- Code block → `background: var(--code-background); color: var(--code-normal)`
- Blockquote → left border using `var(--interactive-accent)`, background slightly different
- List markers (bullets) → `color: var(--list-marker-color)`
- `#sample-tag` → `color: var(--tag-color); background: var(--tag-background)`
- Text selection → if possible, style `::selection` with `var(--text-selection)`

### 3.6 — Create `src/components/preview/MockRightSidebar.tsx`

Contains:
- **Outline panel** header "Outline" with heading entries:
  - H1: "Welcome to My Vault"
  - H2: "Getting Started"
- **Backlinks panel** header "Backlinks" with 2-3 fake entries:
  - "Projects/Project Alpha.md" with a snippet line
  - "Daily Notes/2024-01-16.md" with a snippet line

Uses `--background-secondary` for background, `--text-muted` for labels, `--text-accent` for clickable items.

### 3.7 — Create `src/components/preview/ClickOverlay.tsx`

Transparent overlay divs positioned over each visual region of the preview. Each overlay:

1. Shows a dashed border outline + tooltip (section label) on hover
2. On click, calls `setActiveSection(sectionId)` from `useTheme()`
3. Uses `pointer-events: auto` on the overlay

Region-to-section mapping:

```typescript
const OVERLAY_REGIONS = [
  { sectionId: 'bg-primary', area: 'editor' },
  { sectionId: 'bg-secondary', area: 'left-sidebar' },
  { sectionId: 'bg-secondary', area: 'right-sidebar' },
  { sectionId: 'bg-tertiary', area: 'titlebar' },
  { sectionId: 'bg-codeblock', area: 'editor-codeblock' },
];
```

For text-level sections (headings, links, code), place smaller overlays directly over the relevant text elements in the editor content. These can be simpler — just highlight the text on hover and show the section name.

The overlay styling should be subtle: transparent by default, light dashed border + semi-transparent background tint + label tooltip on hover.

### 3.8 — Wire PreviewPane into App.tsx

Replace the debug placeholder from Phase 2 with the PreviewPane (taking up the left side of a horizontal split layout). For now, just render PreviewPane — the ConfigPanel comes in Phase 4.

Set up the basic horizontal split layout in App.tsx (left: preview, right: placeholder for config panel).

## Deliverables

After this phase:

- The app shows a convincing Obsidian mock preview
- All colors in the preview respond to state changes (verifiable by changing defaults in code)
- Clicking regions in the preview sets `activeSection`
- Hover effects show which regions are clickable
- The preview is styled purely via CSS variables (no Tailwind in preview elements)

## File Structure After Phase 3

```
src/
├── components/
│   └── preview/
│       ├── PreviewPane.tsx
│       ├── preview.css
│       ├── MockTitleBar.tsx
│       ├── MockLeftSidebar.tsx
│       ├── MockEditor.tsx
│       ├── MockRightSidebar.tsx
│       └── ClickOverlay.tsx
├── App.tsx                  (updated: horizontal split layout with PreviewPane)
```
