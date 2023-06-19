interface Human {
    name: string;
    eat(): void;
}
declare class Asian implements Human {
    constructor(name: string);
    name: string;
    eat(): void;
    age: number;
    sleep(): void;
}
interface Man extends Human {
    run(): void;
}
interface Child {
    cry(): void;
}
interface Boy extends Man, Child {
}
declare let boy: Boy;
declare class Auto {
    state: number;
}
interface AutoInterface extends Auto {
}
declare class C implements AutoInterface {
    state: number;
    state1: number;
}
declare class Bus extends Auto implements AutoInterface {
}
