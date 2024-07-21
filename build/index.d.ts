import { MarkType, NotationOptions, PathRoughOptions } from './types/index.js';
import PathAnimatior from './path-animator/index.js';
import 'roughjs/bin/core';

declare const notate: (target: HTMLElement, mark: MarkType, options?: Partial<NotationOptions & {
    rough: PathRoughOptions;
}>) => PathAnimatior;

export { notate };
