import type { PresetLayout } from '@/types'

export const presetLayouts: PresetLayout[] = [
  {
    name: 'holy-grail',
    label: '圣杯布局',
    gridConfig: {
      columns: 3,
      rows: 3,
      columnWidths: ['200px', '1fr', '200px'],
      rowHeights: ['auto', '1fr', 'auto'],
      columnGap: 16,
      rowGap: 16,
    },
    items: [
      { id: 'h1', label: 'Header', columnStart: 1, columnEnd: 4, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#00D4AA' },
      { id: 'h2', label: 'Left Sidebar', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#45B7D1' },
      { id: 'h3', label: 'Main Content', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#96CEB4' },
      { id: 'h4', label: 'Right Sidebar', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#DDA0DD' },
      { id: 'h5', label: 'Footer', columnStart: 1, columnEnd: 4, rowStart: 3, rowEnd: 4, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#FFEAA7' },
    ],
  },
  {
    name: 'sidebar',
    label: '侧边栏布局',
    gridConfig: {
      columns: 2,
      rows: 2,
      columnWidths: ['240px', '1fr'],
      rowHeights: ['auto', '1fr'],
      columnGap: 0,
      rowGap: 0,
    },
    items: [
      { id: 's1', label: 'Sidebar', columnStart: 1, columnEnd: 2, rowStart: 1, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#2A2D3A' },
      { id: 's2', label: 'Header', columnStart: 2, columnEnd: 3, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#45B7D1' },
      { id: 's3', label: 'Content', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#96CEB4' },
    ],
  },
  {
    name: 'card-grid',
    label: '卡片网格',
    gridConfig: {
      columns: 4,
      rows: 2,
      columnWidths: ['1fr', '1fr', '1fr', '1fr'],
      rowHeights: ['auto', 'auto'],
      columnGap: 20,
      rowGap: 20,
    },
    items: [
      { id: 'c1', label: 'Card 1', columnStart: 1, columnEnd: 2, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#00D4AA' },
      { id: 'c2', label: 'Card 2', columnStart: 2, columnEnd: 3, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#FF6B6B' },
      { id: 'c3', label: 'Card 3', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#45B7D1' },
      { id: 'c4', label: 'Card 4', columnStart: 4, columnEnd: 5, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#DDA0DD' },
      { id: 'c5', label: 'Card 5', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#F7DC6F' },
      { id: 'c6', label: 'Card 6', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#82E0AA' },
      { id: 'c7', label: 'Card 7', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#F0B27A' },
      { id: 'c8', label: 'Card 8', columnStart: 4, columnEnd: 5, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#85C1E9' },
    ],
  },
  {
    name: 'magazine',
    label: '杂志排版',
    gridConfig: {
      columns: 4,
      rows: 3,
      columnWidths: ['1fr', '1fr', '1fr', '1fr'],
      rowHeights: ['200px', '200px', '200px'],
      columnGap: 16,
      rowGap: 16,
    },
    items: [
      { id: 'm1', label: 'Featured', columnStart: 1, columnEnd: 3, rowStart: 1, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#00D4AA' },
      { id: 'm2', label: 'Article 1', columnStart: 3, columnEnd: 5, rowStart: 1, rowEnd: 2, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#FF6B6B' },
      { id: 'm3', label: 'Article 2', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#45B7D1' },
      { id: 'm4', label: 'Article 3', columnStart: 4, columnEnd: 5, rowStart: 2, rowEnd: 3, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#DDA0DD' },
      { id: 'm5', label: 'Bottom Bar', columnStart: 1, columnEnd: 5, rowStart: 3, rowEnd: 4, justifySelf: 'stretch', alignSelf: 'stretch', backgroundColor: '#2A2D3A' },
    ],
  },
]
