declare function add1(x: number, y: number): number;
declare let add: Add;
declare type Add = (x: number, y: number) => number;
declare type add3 = (x: number, y: number) => number;
interface add4 {
    (x: number, y: number): number;
}
declare function add2(x?: number, ...res: number[]): number;
declare function add3(x: string): string;
declare function add3(x: number): number;
