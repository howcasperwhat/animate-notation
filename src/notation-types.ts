import type { Drawable, Options as RoughOptions } from "roughjs/bin/core"

export type Paths = string[]

export type MultiBracket =
  0b0000 | 0b0001 | 0b0010 | 0b0011 |
  0b0100 | 0b0101 | 0b0110 | 0b0111 |
  0b1000 | 0b1001 | 0b1010 | 0b1011 |
  0b1100 | 0b1101 | 0b1110 | 0b1111

export type SingleBracket =
  0b0001 | 0b0010 | 0b0100 | 0b1000

export type Constructor<T> = (w: number, h: number) => T
export type Path = string | Drawable
export type OrArrayOf<T> = T | Array<T>
export type OrConstructorOf<T> = T | Constructor<T>
export type PathConstructor = OrConstructorOf<OrArrayOf<Path>>

export type MarkType = 'o' | '_' | '=' | '-' | 'x' | '[]' | 'box'

export type PathRoughOptions = Omit<RoughOptions,
  'disableMultiStroke' | 'stroke' | 'strokeWidth' |
  'fill' | 'fillStyle' | 'fillWeight'>

export interface NotationOptions {
  linecap: CanvasLineCap
  zIndexOffset: number
  color: string // defaults to currentColor
  strokeWidth: number // default based on type
  iterations: number // defaults to 1
  brackets: MultiBracket // 'lrtb' defaults to 0b1100
  opacity: number // defaults to 1
  class: string
}