import StrokeAnimator from './stroke-animator'
import type { NotationOptions, PathConstructor } from './notation-types'
import { DEFAULT_NOTATION_OPTIONS } from './notation-store'
import { toPaths } from './utility'

const SVG_NS = 'http://www.w3.org/2000/svg'

export default class PathAnimatior {
  private options: NotationOptions

  private target: HTMLElement
  private svg: SVGSVGElement
  private paths: SVGPathElement[]

  private animators: StrokeAnimator[]

  private pathDatas: string[]
  private pathLengths: number[] = []
  private pathsTotalLength: number = 0
  private cur: number
  private rect: DOMRect
  private duration: number

  private createSVG() {
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('viewBox', `0 0 ${this.rect.width} ${this.rect.height}`)
    this.options.class.length && svg.setAttribute('class', this.options.class)
    const style = svg.style
    style.zIndex = this.target.style.zIndex + this.options.zIndexOffset!
    style.overflow = 'visible'
    style.pointerEvents = 'none'
    style.position = 'absolute'
    style.top = '0'
    style.left = '0'
    return svg
  }

  private createPath(data: string, color: string,
    linecap: string, thickness: number, opacity: number) {
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', data)
    path.setAttribute('stroke', color)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke-linecap', linecap)
    path.setAttribute('stroke-width', thickness.toString())
    path.setAttribute('stroke-opacity', opacity.toString())
    return path
  }

  public constructor(
    tar: HTMLElement,
    pcs: PathConstructor,
    options?: Partial<NotationOptions>,
  ) {
    this.options = {
      ...DEFAULT_NOTATION_OPTIONS,
      ...options
    }

    this.target = tar
    this.rect = tar.getBoundingClientRect()

    // pcs: string | Drawable | (string | Drawable)[] |
    //      (w: number, h: number) => string | Drawable | (string | Drawable)[]
    if (typeof pcs === 'function')
      pcs = pcs(this.rect.width, this.rect.height)
    switch (typeof pcs) {
      case 'string':
        this.pathDatas = [pcs]
        break
      case 'object':
        if (!Array.isArray(pcs)) {
          // Drawable
          this.pathDatas = toPaths(pcs)
        } else {
          // (string | Drawable)[]
          this.pathDatas = pcs.map(pc => {
            // string
            if (typeof pc === 'string') return [pc]
            // Drawable
            else return toPaths(pc)
          }).flat()
        }
        break
    }

    this.cur = 0
    this.duration = 1000

    this.svg = this.createSVG()
    this.initTarget()
    this.paths = this.cratePaths()

    this.animators = this.createAnimators()
    this.animators[this.cur].start()
  }

  private initTarget() {
    this.target.style.setProperty('position', 'relative')
    this.target.appendChild(this.svg)
    return this.target
  }

  private cratePaths() {
    const paths = []
    for (const data of this.pathDatas) {
      const path = this.createPath(
        data,
        this.options.color,
        this.options.linecap,
        this.options.strokeWidth,
        this.options.opacity
      )
      paths.push(path)
      const length = path.getTotalLength()
      this.pathLengths.push(length)
      this.pathsTotalLength += length
      this.svg.appendChild(path)
    }
    return paths
  }
  private durationOf(idx: number) {
    return this.duration * this.pathLengths[idx] / this.pathsTotalLength
  }

  private createAnimators() {
    const animators = this.paths.map(path => new StrokeAnimator(path, 0))
    for (let i = 0; i < animators.length; ++i) {
      i !== animators.length - 1 && animators[i].onPainted(() => {
        animators[i].stop()
        this.cur = i + 1
        animators[this.cur].start()
        animators[this.cur].paint(this.durationOf(this.cur))
      })
      i !== 0 && animators[i].onErased(() => {
        animators[i].stop()
        this.cur = i - 1
        animators[this.cur].start()
        animators[this.cur].erase(this.durationOf(this.cur))
      })
    }
    return animators
  }

  public show(duration: number = 1000) {
    this.duration = duration
    this.animators[this.cur].paint(
      this.durationOf(this.cur)
    )
  }

  public stop() {
    this.animators[this.cur].listen()
  }

  public hide(duration: number = 1000) {
    this.duration = duration
    this.animators[this.cur].erase(
      this.durationOf(this.cur)
    )
  }

  public remove() {
    this.animators.forEach(notation => notation.stop())
    this.target.removeChild(this.svg)
  }

  public onShowed(fn: () => void) {
    this.animators[this.animators.length - 1].onPainted(fn)
  }

  public onHidden(fn: () => void) {
    this.animators[0].onErased(fn)
  }
}