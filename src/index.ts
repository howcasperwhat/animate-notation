import type { MarkType, NotationOptions, PathRoughOptions } from './notation-types'
import PathAnimatior from './path-animator'
import PathGenerator from './path-generator'

export function notate(target: HTMLElement, mark: MarkType, options?: Partial<NotationOptions & { rough: PathRoughOptions }>) {
  const o = options || {}
  if (mark === '=') {
    o.linecap = 'butt'
    o.strokeWidth = target.getBoundingClientRect().height
  }
  const pg = new PathGenerator(o.rough)
  const pa = new PathAnimatior(
    target,
    pg.d(mark, options?.brackets),
    options,
  )
  const handle = () => {
    if (mark === '=') {
      o.linecap = 'butt'
      o.strokeWidth = target.getBoundingClientRect().height
    }
    pa.reset(o)
  }
  let timeout: Parameters<typeof clearTimeout>[0]
  const trigger = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    timeout = setTimeout(() => handle(), 100)
  }
  const ro = new ResizeObserver(() => trigger())
  ro.observe(target)
  return pa
}
