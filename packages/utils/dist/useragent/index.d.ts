declare function isMobile(): boolean;
declare function isAndroid(): boolean;
declare function isIos(): boolean;
declare function getBrowserType(): string;
declare const _default: {
    isMobile: typeof isMobile;
    getBrowserType: typeof getBrowserType;
    isAndroid: typeof isAndroid;
    isIos: typeof isIos;
};
export default _default;
