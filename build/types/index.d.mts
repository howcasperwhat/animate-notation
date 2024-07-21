import { Drawable, Options } from 'roughjs/bin/core';

type Paths = string[];
type MultiBracket = 0b0000 | 0b0001 | 0b0010 | 0b0011 | 0b0100 | 0b0101 | 0b0110 | 0b0111 | 0b1000 | 0b1001 | 0b1010 | 0b1011 | 0b1100 | 0b1101 | 0b1110 | 0b1111;
type SingleBracket = 0b0001 | 0b0010 | 0b0100 | 0b1000;
type Constructor<T> = (w: number, h: number) => T;
type Path = string | Drawable;
type OrArrayOf<T> = T | Array<T>;
type OrConstructorOf<T> = T | Constructor<T>;
type PathConstructor = OrConstructorOf<OrArrayOf<Path>>;
type MarkType = 'o' | '_' | '=' | '-' | 'x' | '[]' | 'box';
type PathRoughOptions = Omit<Options, 'disableMultiStroke' | 'stroke' | 'strokeWidth' | 'fill' | 'fillStyle' | 'fillWeight'>;
interface NotationOptions {
    linecap: CanvasLineCap;
    zIndexOffset: number;
    color: string;
    strokeWidth: number;
    iterations: number;
    brackets: MultiBracket;
    opacity: number;
    class: string;
}

export type { Constructor, MarkType, MultiBracket, NotationOptions, OrArrayOf, OrConstructorOf, Path, PathConstructor, PathRoughOptions, Paths, SingleBracket };
