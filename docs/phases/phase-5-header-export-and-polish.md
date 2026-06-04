# Phase 5: Header, Export Modal, and Polish

## Goal

Complete the app with the header bar (theme name, mode toggle, undo/redo), the export modal (CSS preview, copy, download), and final polish (responsive tweaks, edge cases, visual refinements).

## Prerequisites

- Phase 1–4 complete (data layer, state, preview, config panel all functional)

## Tasks

### 5.1 — Create `src/components/Header.tsx`

A horizontal bar at the top of the page containing:

1. **App branding** — "Obsidian Theme Creator" text or small logo on the far left

2. **Theme name input** — text field, placeholder "My Theme", bound to `themeName` state via `setThemeName()`. Styled as an inline editable field (minimal border, looks like plain text until focused).

3. **Mode toggle** — segmented control with "Dark" / "Light" buttons. The active mode is visually highlighted. On click, calls `setMode()`. Switching modes:
   - Saves current colors for the current mode
   - Loads saved colors for the target mode (or defaults if none saved)

4. **Undo / Redo buttons** — icon buttons (↶ / ↷ or similar). Disabled (grayed out) when `canUndo` / `canRedo` is false. On click, call `undo()` / `redo()`.

5. **Export button** — prominent button (accent colored) labeled "Export Theme". On click, opens the ExportModal.

Layout: items spread across the header using flexbox. Theme name + mode toggle on the left/center, undo/redo + export on the right.

### 5.2 — Create `src/components/ExportModal.tsx`

A modal overlay triggered by the Export button. Contains:

1. **Modal backdrop** — semi-transparent dark overlay. Clicking it closes the modal. Escape key also closes.

2. **Mode selector for export** — radio buttons: "Dark only", "Light only", "Both". Default to the currently active mode. If "Both" is selected and the user has only edited one mode, show a warning: "You've only customized [dark/light] mode. The other mode will use default colors."

3. **CSS preview** — a `<pre><code>` block showing the generated CSS from `generateThemeCSS()`. Apply simple syntax highlighting:
   - CSS variable names (`--name`) in one color
   - Values (hex codes) in another color
   - Comments in a muted color
   - Use regex-based string replacement to wrap tokens in `<span>` tags — no syntax highlighting library needed

4. **Copy to Clipboard button** — uses `navigator.clipboard.writeText()`. On success, briefly change button text to "Copied!" for 2 seconds, then revert.

5. **Download button** — generates a `Blob` with `text/css` MIME type, creates a download link via `URL.createObjectURL()`, triggers click, revokes URL. File is named `theme.css`.

6. **Install instructions** — a collapsible `<details>` element at the bottom:
   > Place this file at `.obsidian/themes/<ThemeName>/theme.css` in your vault folder, then go to **Settings → Appearance → Themes** and select your theme.

### 5.3 — Keyboard Shortcuts

Add global keyboard listeners (in a `useEffect` on App or ThemeProvider):

- `Ctrl+Z` / `Cmd+Z` → Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` → Redo
- `Escape` → Clear active section / close modal

### 5.4 — Responsive Layout Polish

Verify and fix the responsive behavior:

- **>=1024px:** Header on top, then horizontal split (preview 60% / config 40%)
- **768px–1023px:** Header on top, then stacked (preview on top, config below, each scrollable)
- **<768px:** Same as above but with tighter padding, smaller preview scale

The preview pane should scale down gracefully — use CSS `transform: scale()` if the container is smaller than the preview's natural size, so it always looks like a complete Obsidian window (just smaller).

### 5.5 — Edge Cases and Final Polish

1. **Empty theme name** — if the user clears the theme name, use "Untitled Theme" in the export
2. **First visit experience** — on first load (no localStorage), start with dark mode defaults and theme name empty
3. **Preview scaling** — ensure the preview looks good at various panel widths. Add a subtle inner shadow or border to frame it
4. **Scrollbar styling** — the config panel's scrollbar should be styled subtly (thin, muted color)
5. **Transitions** — add subtle CSS transitions (150ms) to color changes in the preview so they feel smooth rather than jarring
6. **Focus management** — when a section becomes active, ensure focus is properly managed for keyboard users
7. **Tooltip on preview hover** — ensure the section name tooltip is clearly readable against any background color combination

### 5.6 — Final Integration Verification

Run through the complete testing checklist from the implementation plan:

- [ ] Changing every section color updates the preview in real time
- [ ] Clicking a preview region scrolls to and focuses the correct config entry
- [ ] Dark/Light mode toggle swaps all colors appropriately
- [ ] Undo/Redo works correctly across multiple color changes
- [ ] Hex input accepts `#AABBCC` and `AABBCC`, rejects invalid input
- [ ] Native color picker works and syncs with hex input
- [ ] Export generates valid CSS with correct `body.theme-dark` / `body.theme-light` scoping
- [ ] Copy to clipboard works
- [ ] Download produces a `theme.css` file
- [ ] State persists across page refresh via localStorage
- [ ] Layout is usable at various screen sizes
- [ ] Reset button on each color input reverts to the mode's default
- [ ] Keyboard shortcuts work (Ctrl+Z undo, Ctrl+Shift+Z redo, Escape)

## Deliverables

After this phase, the app is **complete and shippable**:

- Full header with theme naming, mode toggle, undo/redo, and export
- Export modal with CSS preview, copy, download, and install instructions
- All interactions polished and edge cases handled
- Responsive layout working across screen sizes
- Passes the full testing checklist

## File Structure After Phase 5

```
src/
├── App.tsx                  (final layout: Header + split pane + modal)
├── components/
│   ├── Header.tsx
│   ├── ExportModal.tsx
│   ├── preview/
│   │   └── (from Phase 3)
│   └── config/
│       └── (from Phase 4)
```
