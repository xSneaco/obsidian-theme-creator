import { useTheme } from '../context/useTheme';

interface HeaderProps {
  onExportClick: () => void;
}

export function Header({ onExportClick }: HeaderProps) {
  const {
    state,
    setMode,
    setThemeName,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useTheme();

  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* App branding */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
          O
        </div>
        <div>
          <h1 className="font-semibold text-base leading-none text-slate-100">Obsidian Theme Creator</h1>
          <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">Visually build themes in real-time</p>
        </div>
      </div>

      {/* Theme name input + Mode Toggle (Left/Center) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:flex-1 justify-center max-w-xl">
        {/* Theme Name input - styled to look like plain text until hovered/focused */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-full sm:w-64 border border-transparent hover:border-slate-800/80 focus-within:border-indigo-500/80 focus-within:bg-slate-900/60 transition-all">
          <span className="text-xs text-slate-500 font-medium">Name:</span>
          <input
            type="text"
            value={state.themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="bg-transparent border-0 p-0 text-slate-200 text-sm font-semibold focus:ring-0 focus:outline-none w-full placeholder:text-slate-600 placeholder:italic"
            placeholder="My Theme"
          />
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setMode('dark')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              state.mode === 'dark'
                ? 'bg-slate-800 text-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setMode('light')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              state.mode === 'light'
                ? 'bg-slate-800 text-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Light
          </button>
        </div>
      </div>

      {/* Controls & Export on the right */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
        {/* Undo/Redo/Reset */}
        <div className="flex items-center border border-slate-800 bg-slate-900 rounded-lg p-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 px-3 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <span className="text-sm font-bold leading-none">↶</span>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 px-3 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            <span className="text-sm font-bold leading-none">↷</span>
          </button>
          <div className="w-[1px] h-4 bg-slate-800 mx-1"></div>
          <button
            onClick={reset}
            className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Reset current mode colors to defaults"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          Export Theme
        </button>
      </div>
    </header>
  );
}

export default Header;
