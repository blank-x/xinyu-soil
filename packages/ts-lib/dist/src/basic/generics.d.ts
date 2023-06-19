declare function log<T>(value: T): T;
declare type Log1 = <T>(value: T) => T;
declare let myLog: Log1;
interface Logs<T = string> {
    (value: T): T;
}
declare let myLog3: Logs<number>;
declare let myLog4: Logs;
declare class Log<T> {
    run(value: T): T;
}
declare let log1: Log<number>;
declare let log2: Log<unknown>;
interface Length {
    length: number;
}
declare function logAdvance<T extends Length>(value: T): T;
