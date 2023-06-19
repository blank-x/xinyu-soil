interface List {
    readonly id: number;
    name: string;
    age?: number;
}
interface Result {
    data: List[];
}
declare function render(result: Result): void;
declare let result: {
    data: ({
        id: number;
        name: string;
        sex: string;
        age?: undefined;
    } | {
        id: number;
        name: string;
        age: number;
        sex?: undefined;
    })[];
};
interface StringArray {
    [index: number]: string;
}
declare let chars: StringArray;
interface Names {
    [x: string]: any;
    y: number;
    [z: number]: number;
}
interface Lib {
    (): void;
    version: string;
    doSomething(): void;
}
declare function getLib(): Lib;
declare let lib1: Lib;
declare let lib2: Lib;
