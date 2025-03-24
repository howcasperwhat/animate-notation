import type { MarkType, NotationOptions, PathRoughOptions } from './notation-types'
import PathAnimatior from './path-animator'
import PathGenerator from './path-generator'

export function notate(target: HTMLElement, mark: MarkType, options?: Partial<NotationOptions & { rough: PathRoughOptions }>) {
  const o = options || {}
  if (mark === '=') {
    o.linecap = 'butt'
    o.strokeWidth = target.getBoundingClientRect().height
  }
  const pg = new PathGenerator(options?.rough)
  const pa = new PathAnimatior(
    target,
    pg.d(mark, options?.brackets),
    options,
  )
  return pa
}
