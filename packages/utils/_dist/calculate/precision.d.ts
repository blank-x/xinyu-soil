declare type numType = number | string;
/**
 * 是否进行边界检查，默认开启
 */
declare function enableBoundaryChecking(flag?: boolean): void;
/**
 * 把错误的数据转正
 */
declare function strip(num: numType, precision?: number): number;
/**
 * 获取小数点后的位数, 0舍去
 */
declare function digitLength(num: numType): number;
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 */
declare function float2Fixed(num: numType): number;
/**
 * 精确乘法
 */
declare function times(num1: numType, num2: numType, ...others: numType[]): number;
/**
 * 精确加法
 */
declare function plus(num1: numType, num2: numType, ...others: numType[]): number;
/**
 * 精确减法
 */
declare function minus(num1: numType, num2: numType, ...others: numType[]): number;
/**
 * 精确除法
 */
declare function divide(num1: numType, num2: numType, ...others: numType[]): number;
/**
 * 四舍五入
 */
declare function round(num: numType, ratio: number): number;
export { strip, plus, minus, times, divide, round, digitLength, float2Fixed, enableBoundaryChecking };
declare const _default: {
    strip: typeof strip;
    plus: typeof plus;
    minus: typeof minus;
    times: typeof times;
    divide: typeof divide;
    round: typeof round;
    digitLength: typeof digitLength;
    float2Fixed: typeof float2Fixed;
    enableBoundaryChecking: typeof enableBoundaryChecking;
};
export default _default;
