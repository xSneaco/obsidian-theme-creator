import { useTheme } from '../../context/useTheme';

export function MockTitleBar() {
  const { state } = useTheme();

  return (
    <div className="preview-titlebar">
      <div className="preview-titlebar-left">
        <div className="preview-titlebar-dots">
          <div className="preview-titlebar-dot close" />
          <div className="preview-titlebar-dot minimize" />
          <div className="preview-titlebar-dot maximize" />
        </div>
      </div>
      
      <div className="preview-titlebar-center">
        <svg className="w-3.5 h-3.5 opacity-60 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A9 9 0 007.5 4.143M2.25 12.75A8.986 8.986 0 0110.5 12.75M2.25 12.75h1.5m18 0v-.75A9 9 0 0016.5 4.143m5.25 8.607a8.986 8.986 0 00-6.75 0m6.75 0h-1.5m-18 0h18M10.5 12.75h3m-3 0v.75m0-.75a9 9 0 001.5 5.25m3-5.25h-3m3 0v.75m0-.75A9 9 0 0113.5 18v.75" />
        </svg>
        <span>{state.themeName || 'My Vault'}</span>
      </div>

      <div className="preview-titlebar-right">
        {/* Navigation buttons mock */}
        <div className="flex items-center gap-1.5 opacity-60">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
