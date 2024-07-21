import { MarkType, NotationOptions, PathRoughOptions } from './types/index.mjs';
import PathAnimatior from './path-animator/index.mjs';
import 'roughjs/bin/core';

declare const notate: (target: HTMLElement, mark: MarkType, options?: Partial<NotationOptions & {
    rough: PathRoughOptions;
}>) => PathAnimatior;

export { notate };
