

export function MockRightSidebar() {
  return (
    <div className="preview-sidebar right">
      {/* Outline Panel */}
      <div className="preview-right-panel">
        <div className="preview-right-panel-title">Outline</div>
        <div className="preview-right-panel-list">
          <div className="preview-right-panel-item outline-h1" title="Heading 1 Link">
            Welcome to My Vault
          </div>
          <div className="preview-right-panel-item outline-h2" title="Heading 2 Link">
            Getting Started
          </div>
        </div>
      </div>

      {/* Backlinks Panel */}
      <div className="preview-right-panel">
        <div className="preview-right-panel-title">Backlinks</div>
        <div className="preview-right-panel-list">
          <div>
            <div className="preview-right-panel-item preview-backlink-item">
              Projects/Project Alpha.md
            </div>
            <div className="preview-backlink-snippet">
              ...link to [[README]] for more information...
            </div>
          </div>
          <div>
            <div className="preview-right-panel-item preview-backlink-item">
              Daily Notes/2024-01-16.md
            </div>
            <div className="preview-backlink-snippet">
              ...created the main documentation in [[README]]...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
