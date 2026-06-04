export type SectionGroup = 'backgrounds' | 'text' | 'ui-elements' | 'syntax';

export interface ThemeSection {
  id: string;
  label: string;
  description: string;
  group: SectionGroup;
  cssVariables: string[];
  defaultDark: string;
  defaultLight: string;
  previewSelector: string;
}

export const SECTIONS: ThemeSection[] = [
  // Backgrounds group (5 sections)
  {
    id: 'bg-primary',
    label: 'Editor Background',
    description: 'Main background color of the editing pane.',
    group: 'backgrounds',
    cssVariables: ['--background-primary'],
    defaultDark: '#1e1e1e',
    defaultLight: '#ffffff',
    previewSelector: '.preview-editor'
  },
  {
    id: 'bg-secondary',
    label: 'Sidebar Background',
    description: 'Background color of the sidebars, folder trees, and panels.',
    group: 'backgrounds',
    cssVariables: ['--background-secondary', '--background-secondary-alt'],
    defaultDark: '#202020',
    defaultLight: '#f2f3f5',
    previewSelector: '.preview-sidebar'
  },
  {
    id: 'bg-tertiary',
    label: 'Titlebar / Tab Bar',
    description: 'Background color of the app titlebar and workspace tab headers.',
    group: 'backgrounds',
    cssVariables: ['--titlebar-background', '--titlebar-background-focused'],
    defaultDark: '#191919',
    defaultLight: '#e9e9e9',
    previewSelector: '.preview-titlebar'
  },
  {
    id: 'bg-codeblock',
    label: 'Code Block Background',
    description: 'Background color of fenced code blocks.',
    group: 'backgrounds',
    cssVariables: ['--code-background'],
    defaultDark: '#2b2b2b',
    defaultLight: '#f4f4f4',
    previewSelector: '.preview-codeblock'
  },
  {
    id: 'bg-tag',
    label: 'Tag Background',
    description: 'Background color of tags in the editor.',
    group: 'backgrounds',
    cssVariables: ['--tag-background'],
    defaultDark: '#ffffff1a',
    defaultLight: '#0000000d',
    previewSelector: '.preview-tag'
  },

  // Text group (6 sections)
  {
    id: 'text-normal',
    label: 'Normal Text',
    description: 'Primary text color for notes and editor content.',
    group: 'text',
    cssVariables: ['--text-normal'],
    defaultDark: '#dcddde',
    defaultLight: '#2e3338',
    previewSelector: '.preview-text-normal'
  },
  {
    id: 'text-muted',
    label: 'Muted / Secondary Text',
    description: 'Color for description text, faint hints, and secondary labels.',
    group: 'text',
    cssVariables: ['--text-muted', '--text-faint'],
    defaultDark: '#999999',
    defaultLight: '#888888',
    previewSelector: '.preview-text-muted'
  },
  {
    id: 'text-accent',
    label: 'Links / Accent Text',
    description: 'Color for hyperlinks, internal wiki links, and secondary accents.',
    group: 'text',
    cssVariables: ['--text-accent', '--text-accent-hover'],
    defaultDark: '#7f6df2',
    defaultLight: '#705dcf',
    previewSelector: '.preview-text-accent'
  },
  {
    id: 'text-on-accent',
    label: 'Text on Accent Color',
    description: 'Text color used on top of interactive accent backgrounds.',
    group: 'text',
    cssVariables: ['--text-on-accent'],
    defaultDark: '#ffffff',
    defaultLight: '#ffffff',
    previewSelector: '.preview-text-on-accent'
  },
  {
    id: 'text-heading',
    label: 'Heading Color',
    description: 'Color applied to all headings (H1 through H6).',
    group: 'text',
    cssVariables: ['--h1-color', '--h2-color', '--h3-color', '--h4-color', '--h5-color', '--h6-color'],
    defaultDark: '#dcddde',
    defaultLight: '#2e3338',
    previewSelector: '.preview-heading'
  },
  {
    id: 'text-inline-code',
    label: 'Inline Code',
    description: 'Text color of inline code spans.',
    group: 'text',
    cssVariables: ['--code-normal'],
    defaultDark: '#e06c75',
    defaultLight: '#c7254e',
    previewSelector: '.preview-inline-code'
  },

  // UI Elements group (5 sections)
  {
    id: 'interactive-accent',
    label: 'Interactive Accent',
    description: 'Primary accent color for active UI elements (buttons, active tabs, settings).',
    group: 'ui-elements',
    cssVariables: ['--interactive-accent', '--interactive-accent-hover'],
    defaultDark: '#7f6df2',
    defaultLight: '#705dcf',
    previewSelector: '.preview-interactive-accent'
  },
  {
    id: 'border-color',
    label: 'Borders / Dividers',
    description: 'Color for app panel dividers, borders, and modal borders.',
    group: 'ui-elements',
    cssVariables: ['--background-modifier-border', '--background-modifier-border-hover'],
    defaultDark: '#333333',
    defaultLight: '#dcdcdc',
    previewSelector: '.preview-border'
  },
  {
    id: 'scrollbar',
    label: 'Scrollbar Thumb',
    description: 'Color of scrollbar thumb.',
    group: 'ui-elements',
    cssVariables: ['--scrollbar-thumb-bg'],
    defaultDark: '#ffffff33',
    defaultLight: '#00000033',
    previewSelector: '.preview-scrollbar'
  },
  {
    id: 'selection',
    label: 'Text Selection Highlight',
    description: 'Background color of selected text inside the editor.',
    group: 'ui-elements',
    cssVariables: ['--text-selection'],
    defaultDark: '#7f6df233',
    defaultLight: '#705dcf33',
    previewSelector: '.preview-selection'
  },
  {
    id: 'search-highlight',
    label: 'Search Match Highlight',
    description: 'Background color of highlighted search results.',
    group: 'ui-elements',
    cssVariables: ['--text-highlight-bg'],
    defaultDark: '#ffd40080',
    defaultLight: '#ffd40080',
    previewSelector: '.preview-search-highlight'
  },

  // Syntax group (4 sections)
  {
    id: 'bold-color',
    label: 'Bold Text',
    description: 'Color of bold text in editor view.',
    group: 'syntax',
    cssVariables: ['--bold-color'],
    defaultDark: '#dcddde',
    defaultLight: '#2e3338',
    previewSelector: '.preview-bold'
  },
  {
    id: 'italic-color',
    label: 'Italic Text',
    description: 'Color of italic text in editor view.',
    group: 'syntax',
    cssVariables: ['--italic-color'],
    defaultDark: '#dcddde',
    defaultLight: '#2e3338',
    previewSelector: '.preview-italic'
  },
  {
    id: 'tag-text',
    label: 'Tag Text Color',
    description: 'Text color of hashtags in editor view.',
    group: 'syntax',
    cssVariables: ['--tag-color'],
    defaultDark: '#7f6df2',
    defaultLight: '#705dcf',
    previewSelector: '.preview-tag-text'
  },
  {
    id: 'list-marker',
    label: 'List Marker / Bullet',
    description: 'Color of bullets, numbering, and checkboxes.',
    group: 'syntax',
    cssVariables: ['--list-marker-color'],
    defaultDark: '#7f6df2',
    defaultLight: '#705dcf',
    previewSelector: '.preview-list-marker'
  }
];
