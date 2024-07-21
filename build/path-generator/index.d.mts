import { RoughGenerator } from 'roughjs/bin/generator';
import { PathRoughOptions, MarkType, MultiBracket, PathConstructor } from '../types/index.mjs';
import 'roughjs/bin/core';

declare class PathGenerator extends RoughGenerator {
    constructor(options?: PathRoughOptions);
    private bracket;
    d(m: MarkType, b?: MultiBracket): PathConstructor;
}

export { PathGenerator as default };
