import type { OpSet, Drawable } from "roughjs/bin/core"

export function toPaths(d: Drawable) {
  return opsToPath(d.sets)
}

// https://github.com/rough-stuff/rough-notation
function opsToPath(opList: OpSet[]): string[] {
  const paths: string[] = []
  for (const drawing of opList) {
    let path = ''
    for (const item of drawing.ops) {
      const data = item.data
      switch (item.op) {
        case 'move':
          if (path.trim())
            paths.push(path.trim())
          path = `M${data[0]} ${data[1]} `
          break
        case 'bcurveTo':
          path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `
          break
        case 'lineTo':
          path += `L${data[0]} ${data[1]} `
          break
      }
    }
    if (path.trim())
      paths.push(path.trim())
  }
  return paths
}
