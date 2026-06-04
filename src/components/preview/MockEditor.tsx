import React from 'react';
import { useTheme } from '../../context/useTheme';

interface InteractiveTextProps {
  sectionId: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function InteractiveText({ sectionId, label, children, className = '', style }: InteractiveTextProps) {
  const { state, setActiveSection } = useTheme();
  const isActive = state.activeSection === sectionId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSection(sectionId);
  };

  return (
    <span
      onClick={handleClick}
      className={`preview-text-highlight ${isActive ? 'active-text-outline' : ''} ${className}`}
      data-label={label}
      style={style}
    >
      {children}
    </span>
  );
}

export function MockEditor() {
  const { state, setActiveSection } = useTheme();

  return (
    <div className="preview-editor">
      {/* Tabs */}
      <div className="preview-tab-bar">
        <div className="preview-tab active">
          <span>README.md</span>
          <span className="preview-tab-close">×</span>
        </div>
        <div className="preview-tab">
          <span>Daily Notes.md</span>
          <span className="preview-tab-close">×</span>
        </div>
        <div className="preview-tab">
          <span>Project Alpha.md</span>
          <span className="preview-tab-close">×</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="preview-editor-content">
        {/* H1 Heading */}
        <div className="mb-3">
          <InteractiveText sectionId="text-heading" label="Heading Color">
            <h1>Welcome to My Vault</h1>
          </InteractiveText>
        </div>

        {/* H2 Heading */}
        <div className="mb-3">
          <InteractiveText sectionId="text-heading" label="Heading Color">
            <h2>Getting Started</h2>
          </InteractiveText>
        </div>

        {/* Paragraph with bold, italic, wiki link, external link */}
        <p>
          This is a sample note demonstrating your theme. You can see how{' '}
          <InteractiveText sectionId="bold-color" label="Bold Color">
            <strong>bold text</strong>
          </InteractiveText>{' '}
          and{' '}
          <InteractiveText sectionId="italic-color" label="Italic Color">
            <em>italic text</em>
          </InteractiveText>{' '}
          appear, along with{' '}
          <InteractiveText sectionId="text-accent" label="Wiki Link">
            <span className="preview-wiki-link">[[Internal Link]]</span>
          </InteractiveText>{' '}
          references and{' '}
          <InteractiveText sectionId="text-accent" label="External Link">
            <a className="preview-external-link" href="#" onClick={(e) => e.preventDefault()}>
              external links
            </a>
          </InteractiveText>
          .
        </p>

        {/* Paragraph with inline code */}
        <p>
          Here's some{' '}
          <InteractiveText sectionId="text-inline-code" label="Inline Code">
            <code>inline code</code>
          </InteractiveText>{' '}
          in a sentence.
        </p>

        {/* Blockquote (styled with accent border-left) */}
        <blockquote>
          <p>This is a blockquote that might contain useful information.</p>
        </blockquote>

        {/* Bullet List */}
        <ul>
          <li>
            <InteractiveText sectionId="list-marker" label="List Marker">
              First bullet point
            </InteractiveText>
          </li>
          <li>
            <InteractiveText sectionId="list-marker" label="List Marker">
              Second bullet point
            </InteractiveText>
          </li>
          <li>
            <InteractiveText sectionId="list-marker" label="List Marker">
              Third with a
            </InteractiveText>
            {/* Tag section: has two options, bg-tag & tag-text. We can target them. */}
            <InteractiveText sectionId="tag-text" label="Tag Text Color">
              <span 
                className="preview-tag" 
                style={{ background: 'var(--tag-background)' }}
                onClick={(e) => {
                  // If we want tag background selection, let's let the parent click or let this select tag-text
                  // We'll map the main tag to tag-text, and we can map a tag wrapper to bg-tag
                  e.stopPropagation();
                  setActiveSection('tag-text');
                }}
              >
                #sample-tag
              </span>
            </InteractiveText>
          </li>
        </ul>

        {/* Codeblock */}
        <div 
          className="preview-codeblock-container relative group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSection('bg-codeblock');
          }}
          title="Click to select Code Block Background"
        >
          <pre className={`transition-all ${state.activeSection === 'bg-codeblock' ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-400'}`}>
            <code>
{`def hello():
    print("Hello, Obsidian!")`}
            </code>
          </pre>
          <div className="absolute top-2 right-2 text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            bg-codeblock
          </div>
        </div>
      </div>
    </div>
  );
}
