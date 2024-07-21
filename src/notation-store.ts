import { Options as RoughOptions } from 'roughjs/bin/core'
import { RoughGenerator } from 'roughjs/bin/generator'
import { NotationOptions } from './notation-types'

export const DEFAULT_ROUGH_OPTIONS: RoughOptions = {
  ...new RoughGenerator().defaultOptions,
  disableMultiStroke: true
}

export const DEFAULT_NOTATION_OPTIONS: NotationOptions = {
  linecap: 'round',
  zIndexOffset: 0,
  color: 'currentColor',
  strokeWidth: 2,
  iterations: 1,
  brackets: 0b0101,
  opacity: 1,
  class: ''
}