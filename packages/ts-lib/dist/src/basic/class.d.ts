declare abstract class Animal {
    eat(): void;
    abstract sleep(): void;
}
declare class Dog extends Animal {
    constructor(name: string);
    name: string;
    run(): void;
    private pri;
    protected pro(): void;
    readonly legs: number;
    static food: string;
    sleep(): void;
}
declare let dog: Dog;
declare class Husky extends Dog {
    color: string;
    constructor(name: string, color: string);
}
declare class Cat extends Animal {
    sleep(): void;
}
declare let cat: Cat;
declare let animals: Animal[];
declare class A {
    name: string;
    constructor(name: string);
}
