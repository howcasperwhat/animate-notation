import { PathConstructor, NotationOptions } from '../types/index.js';
import 'roughjs/bin/core';

declare class PathAnimatior {
    private options;
    private target;
    private svg;
    private paths;
    private animators;
    private pathDatas;
    private pathLengths;
    private pathsTotalLength;
    private cur;
    private rect;
    private duration;
    private createSVG;
    private createPath;
    constructor(tar: HTMLElement, pcs: PathConstructor, options?: Partial<NotationOptions>);
    private initTarget;
    private cratePaths;
    private durationOf;
    private createAnimators;
    show(duration?: number): void;
    stop(): void;
    hide(duration?: number): void;
    remove(): void;
    onShowed(fn: () => void): void;
    onHidden(fn: () => void): void;
}

export { PathAnimatior as default };
