# Phase 2: State Management + Context

## Goal

Implement the ThemeProvider context, reducer with undo/redo, and localStorage persistence. After this phase, the app has a fully functional state layer that any UI component can consume via `useTheme()`.

## Prerequisites

- Phase 1 complete (all `src/theme/` modules exist and work)

## Tasks

### 2.1 — Create `src/context/ThemeProvider.tsx`

Implement a React context + `useReducer` that manages the entire theme state:

```typescript
interface ThemeState {
  themeName: string;
  mode: 'dark' | 'light';
  colors: Record<string, string>;  // section.id -> hex value
  history: ThemeState[];            // past states for undo (colors snapshots only)
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

**Reducer behavior:**

- `SET_COLOR` — Push current `colors` onto `history` (cap at 50 entries), clear `future`, update the color for the given section ID. Validate hex before applying.
- `SET_MODE` — Switch between dark/light. Load defaults from `getDefaultColors(mode)` for any section that hasn't been customized in that mode. Store per-mode colors so switching back restores the user's previous edits.
- `SET_THEME_NAME` — Update `themeName`. Does not affect undo history.
- `SET_ACTIVE_SECTION` — Set which section is currently highlighted/focused. Does not affect undo history.
- `LOAD_PRESET` — Replace all colors with the preset's colors. Push current state to history.
- `UNDO` — Pop from `history`, push current `colors` onto `future`, restore popped colors.
- `REDO` — Pop from `future`, push current `colors` onto `history`, restore popped colors.
- `RESET` — Restore all colors to the defaults for the current mode. Push current to history.

**Important:** The `history` and `future` arrays should only store `colors` snapshots (not the full state), to keep memory usage reasonable.

The provider should:
1. On mount, read saved state from `localStorage` (key: `obsidian-theme-creator-state`). If present, use it; otherwise initialize with dark mode defaults.
2. Wrap children in the context provider, exposing `state` and `dispatch`.

### 2.2 — Create `src/context/useTheme.ts`

A convenience hook:

```typescript
function useTheme(): {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
  // Convenience methods:
  setColor: (sectionId: string, hex: string) => void;
  setMode: (mode: 'dark' | 'light') => void;
  setThemeName: (name: string) => void;
  setActiveSection: (sectionId: string | null) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

Throws an error if used outside `ThemeProvider`.

### 2.3 — localStorage Persistence

Inside ThemeProvider, add a `useEffect` that debounce-writes to `localStorage` whenever `colors`, `mode`, or `themeName` change. Use a 500ms debounce.

**What to persist:** `{ colors, mode, themeName }` — do NOT persist `history`, `future`, or `activeSection`.

**What to restore on mount:** Read the persisted object. If `colors` is present, use it. If `mode` is present, use it. Merge with defaults so any newly-added sections get default values.

### 2.4 — Per-Mode Color Storage

The state should support independent color configurations for dark and light modes. When the user switches modes:

1. Save the current `colors` map keyed by the current mode (e.g., in a `modeColors` record: `{ dark: Record<string, string>, light: Record<string, string> }`)
2. Load the stored colors for the target mode, falling back to defaults for any section that wasn't customized

This means `localStorage` should persist:

```typescript
{
  themeName: string;
  mode: 'dark' | 'light';
  darkColors: Record<string, string>;
  lightColors: Record<string, string>;
}
```

### 2.5 — Wire ThemeProvider into App.tsx

Wrap the App component tree with `<ThemeProvider>`. For now, render a minimal placeholder that displays the current mode and a few color values to verify the state layer works. This placeholder will be replaced in Phase 3.

## Deliverables

After this phase:

- `useTheme()` hook is fully functional from any component inside the provider
- Color changes are tracked with undo/redo (50-entry cap)
- State persists across page refresh
- Dark/light mode switching preserves per-mode edits
- The app renders a simple debug view showing state works

## File Structure After Phase 2

```
src/
├── context/
│   ├── ThemeProvider.tsx
│   └── useTheme.ts
├── App.tsx                  (updated: wraps with ThemeProvider, shows debug UI)
```
