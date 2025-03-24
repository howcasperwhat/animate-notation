import type { Options as RoughOptions } from 'roughjs/bin/core'
import type { NotationOptions } from './notation-types'
import { RoughGenerator } from 'roughjs/bin/generator'

export const DEFAULT_ROUGH_OPTIONS: RoughOptions = {
  ...new RoughGenerator().defaultOptions,
  disableMultiStroke: true,
}

export const DEFAULT_NOTATION_OPTIONS: NotationOptions = {
  linecap: 'round',
  zIndexOffset: 0,
  color: 'currentColor',
  strokeWidth: 2,
  iterations: 1,
  brackets: 0b0101,
  opacity: 1,
  class: '',
}
