import type { MarkType, NotationOptions, PathRoughOptions } from './notation-types'
import PathAnimatior from './path-animator'
import PathGenerator from './path-generator'

export function notate(
  target: HTMLElement,
  mark: MarkType,
  options?: Partial<NotationOptions & { rough: PathRoughOptions, resizeTimer: number }>,
) {
  const o = options ?? {}
  mark === '=' && Object.assign(o, {
    linecap: 'butt',
    strokeWidth: target.getBoundingClientRect().height,
  })
  const pg = new PathGenerator(o.rough)
  const pa = new PathAnimatior(
    target,
    pg.d(mark, options?.brackets),
    options,
  )
  const handle = () => {
    mark === '=' && Object.assign(o, {
      linecap: 'butt',
      strokeWidth: target.getBoundingClientRect().height,
    })
    pa.reset(o)
  }
  let timeout: Parameters<typeof clearTimeout>[0]
  const trigger = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    timeout = setTimeout(handle, options?.resizeTimer ?? 100)
  }
  new ResizeObserver(trigger).observe(target)
  return pa
}
