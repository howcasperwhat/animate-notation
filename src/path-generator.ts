
import { RoughGenerator } from 'roughjs/bin/generator'
import type { PathRoughOptions, MarkType, PathConstructor, MultiBracket, SingleBracket } from './notation-types'
import { DEFAULT_ROUGH_OPTIONS } from './notation-store'
import { toPaths as tp } from './utility'


export default class PathGenerator extends RoughGenerator {
  public constructor(options: PathRoughOptions = {}) {
    super({
      options: {
        ...DEFAULT_ROUGH_OPTIONS,
        ...options
      }
    })
  }

  private bracket(
    x: number, y: number,
    w: number, h: number,
    bracket: 0b1000 | 0b0100 | 0b0010 | 0b0001,
    s: number = 5
  ) {
    switch (bracket) {
      case 0b1000:
        return this.linearPath([
          [x, y + s], [x, y], [x + w, y], [x + w, y + s]
        ])
      case 0b0100:
        return this.linearPath([
          [x + s, y], [x, y], [x, y + h], [x + s, y + h]
        ])
      case 0b0010:
        return this.linearPath([
          [x, y + h - s], [x, y + h], [x + w, y + h], [x + w, y + h - s]
        ])
      case 0b0001:
        return this.linearPath([
          [x + w - s, y], [x + w, y], [x + w, y + h], [x + w - s, y + h]
        ])
    }
  }

  public d(m: MarkType, b: MultiBracket = 0b0101): PathConstructor {
    switch (m) {
      case '-':
      case '=':
        return (w, h) => [
          tp(this.line(0, h / 2, w, h / 2)),
          tp(this.line(w, h / 2, 0, h / 2))
        ].flat()
      case '_':
        return (w, h) => [
          tp(this.line(0, h, w, h)),
          tp(this.line(w, h, 0, h))
        ].flat()
      case 'o':
        return (w, h) => [
          tp(this.ellipse(w / 2, h / 2, w, h)),
          tp(this.ellipse(w / 2, h / 2, w, h))
        ].flat()
      case 'box':
        return (w, h) => [
          tp(this.rectangle(0, 0, w, h)),
          tp(this.rectangle(0, 0, w, h))
        ].flat()
      case '[]':
        return (w, h) => Array.from({ length: 4 }, (_, i) => {
          if (b! & (1 << (3 - i)))
            return tp(
              this.bracket(0, 0, w, h,
                1 << (3 - i) as SingleBracket
              )
            )
          return undefined
        }).filter(x => !!x).flat()
      case 'x':
        return (w, h) => [
          tp(this.linearPath([[0, 0], [w, h]])),
          tp(this.linearPath([[w, 0], [0, h]]))
        ].flat()
    }
  }
}