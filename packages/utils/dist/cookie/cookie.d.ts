export declare function getCookie(name: string): string;
export declare function getAllCookie(): object;
export declare function setCookie(name: string, value: string, exhours: number, path: string, domain: string): void;
export declare function delCookie(name: string, path: string, domain: string): void;
declare const _default: {
    getCookie: typeof getCookie;
    setCookie: typeof setCookie;
    delCookie: typeof delCookie;
    getAllCookie: typeof getAllCookie;
};
export default _default;
