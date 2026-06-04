

export function MockLeftSidebar() {
  return (
    <div className="preview-sidebar left">
      <div className="preview-sidebar-search">
        <input
          type="text"
          className="preview-sidebar-search-input"
          placeholder="Search..."
          disabled
        />
      </div>

      <div className="preview-sidebar-tree">
        {/* Daily Notes Folder (Expanded) */}
        <div>
          <div className="preview-tree-item folder">
            <span className="preview-tree-item-icon">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="preview-tree-item-icon">📁</span>
            <span>Daily Notes</span>
          </div>
          <div className="preview-tree-item file">
            <span className="preview-tree-item-icon">📄</span>
            <span>2024-01-15.md</span>
          </div>
          <div className="preview-tree-item file">
            <span className="preview-tree-item-icon">📄</span>
            <span>2024-01-16.md</span>
          </div>
        </div>

        {/* Projects Folder (Collapsed) */}
        <div>
          <div className="preview-tree-item folder">
            <span className="preview-tree-item-icon">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'rotate(-90deg)' }}>
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="preview-tree-item-icon">📁</span>
            <span>Projects</span>
          </div>
        </div>

        {/* References Folder (Expanded) */}
        <div>
          <div className="preview-tree-item folder">
            <span className="preview-tree-item-icon">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="preview-tree-item-icon">📁</span>
            <span>References</span>
          </div>
          <div className="preview-tree-item file">
            <span className="preview-tree-item-icon">📄</span>
            <span>Reading List.md</span>
          </div>
          <div className="preview-tree-item file">
            <span className="preview-tree-item-icon">📄</span>
            <span>Templates.md</span>
          </div>
        </div>

        {/* README.md (Root File - Active) */}
        <div className="preview-tree-item file active">
          <span className="preview-tree-item-icon">📄</span>
          <span>README.md</span>
        </div>
      </div>

      <div className="preview-sidebar-footer">
        <span className="preview-sidebar-footer-icon" title="Settings">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <span className="preview-sidebar-footer-icon" title="Help">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
