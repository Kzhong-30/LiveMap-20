export interface GridConfig {
  columns: number
  rows: number
  columnWidths: string[]
  rowHeights: string[]
  columnGap: number
  rowGap: number
}

export type AlignSelf = 'start' | 'center' | 'end' | 'stretch'
export type JustifySelf = 'start' | 'center' | 'end' | 'stretch'

export interface GridItem {
  id: string
  label: string
  columnStart: number
  columnEnd: number
  rowStart: number
  rowEnd: number
  justifySelf: JustifySelf
  alignSelf: AlignSelf
  backgroundColor: string
}

export interface BreakpointConfig {
  name: string
  maxWidth: number
  gridConfig: GridConfig
  items: GridItem[]
}

export interface LayoutHistory {
  id: string
  name: string
  timestamp: number
  gridConfig: GridConfig
  items: GridItem[]
  breakpoints: BreakpointConfig[]
}

export interface PresetLayout {
  name: string
  label: string
  gridConfig: GridConfig
  items: GridItem[]
}

export function createDefaultGridConfig(): GridConfig {
  return {
    columns: 3,
    rows: 3,
    columnWidths: Array(3).fill('1fr'),
    rowHeights: Array(3).fill('1fr'),
    columnGap: 16,
    rowGap: 16,
  }
}

export function createDefaultItem(col: number, row: number): GridItem {
  const id = `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    label: `Item ${col},${row}`,
    columnStart: col,
    columnEnd: col + 1,
    rowStart: row,
    rowEnd: row + 1,
    justifySelf: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: randomColor(),
  }
}

const ITEM_COLORS = [
  '#00D4AA', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
  '#85C1E9', '#F0B27A', '#82E0AA', '#F1948A', '#AED6F1',
]

function randomColor(): string {
  return ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)]
}

export function generateGridCSS(config: GridConfig, items: GridItem[], selector = '.grid-container'): string {
  const lines: string[] = []

  lines.push(`${selector} {`)
  lines.push(`  display: grid;`)
  lines.push(`  grid-template-columns: ${config.columnWidths.join(' ')};`)
  lines.push(`  grid-template-rows: ${config.rowHeights.join(' ')};`)
  lines.push(`  column-gap: ${config.columnGap}px;`)
  lines.push(`  row-gap: ${config.rowGap}px;`)
  lines.push(`}`)

  items.forEach((item, index) => {
    lines.push('')
    lines.push(`${selector} > :nth-child(${index + 1}) {`)
    lines.push(`  grid-column: ${item.columnStart} / ${item.columnEnd};`)
    lines.push(`  grid-row: ${item.rowStart} / ${item.rowEnd};`)
    if (item.justifySelf !== 'stretch') {
      lines.push(`  justify-self: ${item.justifySelf};`)
    }
    if (item.alignSelf !== 'stretch') {
      lines.push(`  align-self: ${item.alignSelf};`)
    }
    lines.push(`}`)
  })

  return lines.join('\n')
}

export function generateFullHTML(config: GridConfig, items: GridItem[], breakpoints: BreakpointConfig[]): string {
  const baseCSS = generateGridCSS(config, items)

  let breakpointCSS = ''
  if (breakpoints.length > 0) {
    breakpointCSS = breakpoints.map(bp => {
      const bpCSS = generateGridCSS(bp.gridConfig, bp.items)
      return `@media (max-width: ${bp.maxWidth}px) {\n  ${bpCSS.split('\n').join('\n  ')}\n}`
    }).join('\n\n')
  }

  const itemElements = items.map(item =>
    `  <div class="grid-item" style="background-color: ${item.backgroundColor};">${item.label}</div>`
  ).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Grid Layout</title>
  <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

${baseCSS}${breakpointCSS ? '\n\n' + breakpointCSS : ''}

.grid-item {
  padding: 16px;
  border-radius: 8px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: sans-serif;
  font-weight: 600;
}
  </style>
</head>
<body>
<div class="grid-container">
${itemElements}
</div>
</body>
</html>`
}
