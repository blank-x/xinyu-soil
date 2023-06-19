/**
 * 根据一个对象，拼接成一个query字符串
 *
 * for example:
 *     @example
 *     {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
 *     {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar=2&bar=3'
 *     {foo: '', bar: 2}    // -> 'foo=&bar=2'
 *     {foo: undef, bar: 2}    // -> 'foo=undef&bar=2'
 *     {foo: TRUE, bar: 2}    // -> 'foo=TRUE&bar=2'
 *
 * @param {Object} o json data
 * @param {String} [sep='&'] separator between each pair of data
 * @param {String} [eq='='] separator between key and value of data
 * @param {Boolean} [serializeArray=false] whether add '[]' to array key of data，缺省是把[]符号也编码
 * @return {String}
 * @member KISSY
 */
export declare function makeQuery(queryObj: any, sep?: string, eq?: string, serializeArray?: boolean): string;
/**
 * Parses a URI-like query string and returns an object composed of parameter/value pairs.
 *
 * for example:
 *      @example
 *      'section=blog&id=45'        // -> {section: 'blog', id: '45'}
 *      'section=blog&tag=js&tag=doc' // -> {section: 'blog', tag: ['js', 'doc']}
 *      'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
 *      'id=45&raw'        // -> {id: '45', raw: ''}
 * @param {String} str param string
 * @param {String} [sep='&'] separator between each pair of data
 * @param {String} [eq='='] separator between key and value of data
 * @return {Object} json data
 */
export declare function parseQuery(str: any, sep?: string, eq?: string): any;
export declare function isValidUrl(url: any): boolean;
export declare function parseUrl(url: any): {
    url: any;
    scheme: string;
    host: string;
    port: string;
    origin: string;
    path: string;
    query: string;
    hash: string;
} | null;
export declare function makeUrl(urlObj: any): string;
export declare function setUrlParams(url: string, addObj?: any, delObj?: {}): string;
export declare function getUrlParams(url: any, key?: string | undefined): any;
declare const _default: {
    isValidUrl: typeof isValidUrl;
    setUrlParams: typeof setUrlParams;
    getUrlParams: typeof getUrlParams;
};
export default _default;
