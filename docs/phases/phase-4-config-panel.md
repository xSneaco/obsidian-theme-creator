# Phase 4: Config Panel

## Goal

Build the right-side configuration panel where users browse, search, and edit theme colors. Wire it up to the preview so clicking a preview region scrolls to and highlights the corresponding config entry.

## Prerequisites

- Phase 1 complete (theme data layer)
- Phase 2 complete (state management)
- Phase 3 complete (preview pane with click overlays)

## Tasks

### 4.1 — Create `src/components/config/ConfigPanel.tsx`

A scrollable vertical panel that renders all section groups. It:

1. Reads `activeSection` from `useTheme()`
2. When `activeSection` changes, scrolls to the matching `ColorInput` row using `scrollIntoView({ behavior: 'smooth', block: 'center' })`
3. Organizes sections into groups using `SectionGroup` components

Group order: Backgrounds, Text, UI Elements, Syntax.

### 4.2 — Create `src/components/config/SectionGroup.tsx`

A collapsible group container:

- **Header** — group name (e.g., "Backgrounds") with a chevron icon that toggles collapse/expand
- **Body** — list of `ColorInput` components for sections in this group
- The "Syntax" group starts collapsed by default; all others start expanded
- Smooth expand/collapse animation (CSS transition on max-height or similar)

### 4.3 — Create `src/components/config/ColorInput.tsx`

Each row represents one `ThemeSection` and contains:

1. **Color swatch** (~32px square) — this is a styled `<input type="color">` where the native picker is hidden behind the visual swatch. On change, dispatch `SET_COLOR` immediately (no debounce for native picker).

2. **Hex text input** — accepts `#AABBCC` or `AABBCC` format. Validation:
   - Regex: `/^#?[0-9a-fA-F]{6}$/` (also allow 8-char hex for alpha values like `#ffffff1a`)
   - Show red border while invalid
   - Debounce 300ms before dispatching `SET_COLOR`
   - Normalize to `#xxxxxx` before storing

3. **Section label** — the human-readable name (e.g., "Editor Background")

4. **Reset button** — small circular arrow icon. On click, revert this section's color to the default for the current mode (`defaultDark` or `defaultLight` from the section definition).

5. **Active state** — when `activeSection === section.id`:
   - Row gets a highlight background (subtle accent tint)
   - Hex input is auto-focused
   - Row has a left accent border

6. **Row identification** — add `data-section={section.id}` attribute so ConfigPanel can `querySelector` and `scrollIntoView` to it.

7. **Sync between swatch and text input** — when the native picker changes, update the text input. When text input changes (after debounce + validation), update the swatch.

### 4.4 — Wire Click-to-Config Flow

Complete the interaction flow between preview clicks and the config panel:

1. User clicks a preview region → `setActiveSection(sectionId)` is called (already done in Phase 3)
2. ConfigPanel detects `activeSection` change via `useEffect`
3. Finds the row with `data-section={activeSection}`
4. Calls `scrollIntoView()` on it
5. Focuses the hex input in that row
6. If the section's group is collapsed, auto-expand it first

### 4.5 — Wire ConfigPanel into App.tsx

Place ConfigPanel in the right side of the horizontal split layout alongside PreviewPane on the left. The layout should be:

- **Desktop (>=1024px):** Side-by-side, preview on left (~60% width), config on right (~40% width). Consider making the split resizable with a drag handle.
- **Tablet/narrow (< 1024px):** Stacked vertically, preview on top, config below.

Use Tailwind for the app layout (not the preview internals).

## Deliverables

After this phase:

- All 20 sections are visible and editable in the config panel
- Color changes via swatch or hex input update the preview in real time
- Clicking a preview region scrolls to and highlights the correct config entry
- Section groups collapse/expand correctly
- Reset buttons revert to mode defaults
- Hex validation works (red border on invalid, no dispatch until valid)
- Layout is responsive (side-by-side on desktop, stacked on mobile)

## File Structure After Phase 4

```
src/
├── components/
│   ├── config/
│   │   ├── ConfigPanel.tsx
│   │   ├── SectionGroup.tsx
│   │   └── ColorInput.tsx
├── App.tsx                  (updated: full split layout with PreviewPane + ConfigPanel)
```
